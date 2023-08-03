import { sendSQL } from "../db/db";
import { channelExist, channelsPerUser } from "../channels/channels";
import { loggedUsers } from "../users/users";

export const commands = new Map();
commands.set("ping", (ws: WebSocket, username: string, args: Array<String>) => {
    ws.send("pong!");
});

commands.set(
    "omsg",
    async (ws: WebSocket, username: string, args: Array<String>) => {
        if (args[1] && args[2]) {
            const channel = args[1];
            const msg = args[2];

            channelsPerUser.forEach((v, k) => {
                if (k == username && v.indexOf(String(channel)) != -1) {
                    loggedUsers
                        .get(username)
                        .send(`imsg,${channel},${username},${msg}`);
                }
            });
        } else {
            ws.send("omsg,fail,cmdp");
        }
    }
);
