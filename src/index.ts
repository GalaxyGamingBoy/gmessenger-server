import { WebSocketServer } from "ws";
require("dotenv").config();

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 8080 });

wss.on("connection", (ws) => {
    ws.send(`Hello, Welcome to GMessenger!`);

    ws.on("message", (msg) => {});
});

console.log(`WS Server started in: ${process.env.PORT || 8080}!`);
