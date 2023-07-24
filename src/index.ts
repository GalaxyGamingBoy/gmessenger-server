import express from "express";
import bp from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import url from "url";
import { WebSocketServer } from "ws";
import { commands } from "./commands/commands";
import { sendSQL } from "./db/db";
import { loadChannels } from "./channels/channels";
import { compare, genSalt, hash } from "bcrypt";
import { IncomingMessage } from "http";
import { loggedUsers, userExists } from "./users/users";
require("dotenv").config();

const app = express();
app.use(bp.json());
app.use(cors());

app.get("/", (_, res) => res.status(200).end("GMessenger Live!"));

app.post("/login", async (req, res) => {
    if (!req.body.username && !req.body.password) {
        res.status(422).end("Username or password *missing*!");
        return;
    }
    const username = req.body.username;
    const password = req.body.password;

    const query = JSON.parse(
        await sendSQL(
            `SELECT username, password FROM users WHERE username='${username}';`
        )
    ) as Array<{ username: string; password: string }>;

    if (
        query.length > 0 &&
        (await compare(String(password), query[0].password))
    ) {
        if (!loggedUsers.has(username)) {
            res.status(200).json({
                jwt: jwt.sign(
                    {
                        username: req.body.username,
                        created: Date.now().toString(),
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: 86400 }
                ),
            });
        } else {
            res.status(403).end("Already logged in");
        }
    } else {
        res.status(422).end("Authentication Error");
    }
});

app.post("/register", async (req, res) => {
    if (!req.body.username && !req.body.password) {
        res.status(422).end("Username or password *missing*!");
        return;
    }
    const username = req.body.username;
    const password = req.body.password;

    await sendSQL(
        `INSERT INTO users (username, password, channels) values ('${username}', '${await hash(
            password.toString(),
            await genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 10)
        )}', '${JSON.stringify(["welcome"])}');`
    );

    res.status(200).json({
        jwt: jwt.sign(
            {
                username: req.body.username,
                created: Date.now().toString(),
            },
            process.env.JWT_SECRET,
            { expiresIn: 86400 }
        ),
    });
});

app.post("/validate", async (req, res) => {
    if (!req.body.jwt) {
        res.status(422).end("JWT Token *missing*!");
        return;
    }
    const token = req.body.jwt;

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            res.status(200).json({ result: false });
        } else {
            res.status(200).json({ result: true });
        }
    });
});

const expressServer = app.listen(process.env.PORT || 8080, () =>
    console.log(`Server started in: ${process.env.PORT || 8080}!`)
);

const wss = new WebSocketServer({ server: expressServer, path: "/socket" });

const initSQL = async () => {
    await sendSQL(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, channels TEXT);"
    );

    await sendSQL("CREATE TABLE channels (id INTEGER PRIMARY KEY, name TEXT);")
        .then((_) => sendSQL("INSERT INTO channels (name) VALUES ('welcome');"))
        .catch((_) => console.log("Channel table already exists"));

    await loadChannels();
};

initSQL();

wss.on("connection", (ws, req) => {
    ws.send(`Hello, Welcome to GMessenger!`);
    ws.send("Checking JWT authentication");
    jwt.verify(
        url.parse(req.url, true).query.token as string,
        process.env.JWT_SECRET,
        async (err, dec: { username: string }) => {
            if (err || !(await userExists(dec.username))) {
                ws.send("auth,fail");
                ws.close();
            } else {
                if (!loggedUsers.has(dec.username)) {
                    ws.send("succ,auth");
                    loggedUsers.set(dec.username, ws);
                } else {
                    ws.send("fail,exist");
                }
            }
        }
    );

    ws.on("message", (msg) => {
        const args = msg.toString().split(",");
        const command = args[0];

        if (commands.has(command)) {
            const cmd = commands.get(command) as (
                ws: any,
                username: string,
                args: Array<String>
            ) => {};

            jwt.verify(
                url.parse(req.url, true).query.token as string,
                process.env.JWT_SECRET,
                (err, dec: { username: string }) => {
                    if (err) {
                        ws.send("auth,fail");
                        ws.close();
                    } else {
                        cmd(ws, dec.username, args);
                    }
                }
            );
        } else {
            ws.send("fail,icmd");
        }
    });
});
