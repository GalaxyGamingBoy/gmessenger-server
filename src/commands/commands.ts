export const commands = new Map();
commands.set("ping", (ws: WebSocket, args: Array<String>) => {
    ws.send("pong!");
});
