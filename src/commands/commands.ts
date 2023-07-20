import { sendSQL } from "../db/db";
import { hash, genSalt, compare } from "bcrypt";
import { createSession, channelExist } from "../session/session";
import { userExists, userSessionAuth } from "../users/users";
import validator from "validator";

export const commands = new Map();
commands.set("ping", (ws: WebSocket, args: Array<String>) => {
    ws.send("pong!");
});

commands.set("regi", async (ws: WebSocket, args: Array<String>) => {
    if (args[1]) {
        const type = args[1];
        if (type == "user") {
            if (args[2] && args[3]) {
                const username = args[2];
                const password = args[3];

                if (await userExists(String(username))) {
                    ws.send("fail,exist");
                } else {
                    sendSQL(
                        `INSERT INTO users (username, password, channels) values ('${username}', '${await hash(
                            password.toString(),
                            await genSalt(
                                Number(process.env.BCRYPT_SALT_ROUNDS) || 10
                            )
                        )}', '[]');`
                    );
                    ws.send(`succ,${createSession(String(username), ws)}`);
                }
            } else {
                ws.send("fail,cmdp");
            }
        } else if (type == "chan") {
            if (args[2] && args[3] && args[4]) {
                const channelName = validator
                    .escape(String(args[2]))
                    .replace(" ", "_")
                    .toLocaleLowerCase();
                const username = args[3];
                const session = args[4];

                if (userSessionAuth(String(username), String(session))) {
                    if (!await channelExist(String(channelName))) {
                        sendSQL(
                            `INSERT INTO channels (name) VALUES ('${channelName}')`
                        );
                        ws.send(`succ,${channelName}`);
                    } else {
                        ws.send("fail,exist");
                    }
                } else {
                    ws.send("fail,auth");
                }
            }
        } else {
            ws.send("fail,cmdp");
        }
    }
});

commands.set("logi", async (ws: WebSocket, args: Array<String>) => {
    if (args[1] && args[2]) {
        const username = args[1];
        const password = args[2];

        const query = JSON.parse(
            await sendSQL(
                `SELECT username, password FROM users WHERE username='${username}';`
            )
        ) as Array<{ username: string; password: string }>;

        if (
            query.length > 0 &&
            (await compare(String(password), query[0].password))
        ) {
            ws.send(`succ,${createSession(String(username), ws)}`);
        } else {
            ws.send("fail,cred");
        }
    } else {
        ws.send("fail,cmdp");
    }
});

commands.set("get", async (ws: WebSocket, args: Array<String>) => {
    if (args[1]) {
        const type = args[1];
        if (type == "chan") {
            const query = JSON.parse(
                await sendSQL("SELECT name FROM channels;")
            ) as Array<{ name: string }>;
            ws.send(JSON.stringify(query.map((e) => e.name)));
        }
    } else {
        ws.send("fail,cmdp");
    }
});
