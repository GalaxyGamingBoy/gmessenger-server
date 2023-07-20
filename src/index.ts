import { WebSocketServer } from "ws";
import { commands } from "./commands/commands";
import { sendSQL } from "./db/db";
import { loadChannels } from "./channels/channels";
require("dotenv").config();

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 8080 });

sendSQL(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, channels TEXT);"
);

sendSQL("CREATE TABLE channels (id INTEGER PRIMARY KEY, name TEXT);")
    .then((_) => sendSQL("INSERT INTO channels (name) VALUES ('welcome');"))
    .catch((_) => console.log("Channel table already exists"));

loadChannels();

wss.on("connection", (ws) => {
    ws.send(`Hello, Welcome to GMessenger!`);

    ws.on("message", (msg) => {
        const args = msg.toString().split(",");
        const command = args[0];

        if (commands.has(command)) {
            const cmd = commands.get(command) as (
                ws: any,
                args: Array<String>
            ) => {};

            cmd(ws, args);
        } else {
            ws.send("fail,icmd");
        }
    });
});

console.log(`WS Server started in: ${process.env.PORT || 8080}!`);
