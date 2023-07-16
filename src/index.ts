import { WebSocketServer } from "ws";
import { commands } from "./commands/commands";
require("dotenv").config();

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 8080 });

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
