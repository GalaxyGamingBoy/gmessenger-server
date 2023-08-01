import { sendSQL } from "../db/db";
// import { createSession, channelExist } from "../session/session";
// import { userExists, userSessionAuth } from "../users/users";
import validator from "validator";
import { channelExist, channelsPerUser } from "../channels/channels";
import { loggedUsers } from "../users/users";

export const commands = new Map();
commands.set("ping", (ws: WebSocket, username: string, args: Array<String>) => {
    ws.send("pong!");
});

commands.set(
    "regi",
    async (ws: WebSocket, username: string, args: Array<String>) => {
        if (args[1]) {
            const type = args[1];
            if (type == "chan") {
                if (args[2]) {
                    const channelName = validator
                        .escape(String(args[2]))
                        .replace(" ", "_")
                        .toLocaleLowerCase();

                    if (!(await channelExist(String(channelName)))) {
                        sendSQL(
                            `INSERT INTO channels (name) VALUES ('${channelName}')`
                        );
                        ws.send(`regi,chan,succ,${channelName}`);
                    } else {
                        ws.send("regi,chan,fail,exist");
                    }
                }
            } else {
                ws.send("regi,fail,cmdp");
            }
        }
    }
);

commands.set(
    "get",
    async (ws: WebSocket, username: string, args: Array<String>) => {
        if (args[1]) {
            const type = args[1];
            if (type == "chan") {
                const query = JSON.parse(
                    await sendSQL("SELECT name FROM channels;")
                ) as Array<{ name: string }>;
                ws.send(`get,chan,${Buffer.from(JSON.stringify(query.map((e) => e.name))).toString("base64")}`);
            } else if (type == "sub_chan") {
                ws.send(`get,sub_chan,${Buffer.from(JSON.stringify(channelsPerUser.get(username))).toString("base64")}`);
            } else {
                ws.send("get,fail,cmdp");
            }
        } else {
            ws.send("get,fail,cmdp");
        }
    }
);

commands.set(
    "subs",
    async (ws: WebSocket, username: string, args: Array<String>) => {
        if (args[1] && (await channelExist(String(args[1])))) {
            const channel = args[1];
            if (channelsPerUser.get(username).indexOf(String(channel)) == -1) {
                channelsPerUser.get(username).push(String(channel));
                await sendSQL(
                    `UPDATE users SET channels='${JSON.stringify(
                        channelsPerUser.get(username)
                    )}' WHERE username='${username}'`
                );
                ws.send("subs,succ");
            } else {
                ws.send("subs,fail,exist");
            }
        } else {
            ws.send("subs,fail,cmdp");
        }
    }
);

commands.set(
    "usub",
    async (ws: WebSocket, username: string, args: Array<String>) => {
        if (args[1]) {
            const channel = args[1];

            channelsPerUser.set(
                username,
                channelsPerUser.get(username).filter((e) => e != channel)
            );

            await sendSQL(
                `UPDATE users SET channels='${JSON.stringify(
                    channelsPerUser.get(username)
                )}' WHERE username='${username}'`
            );

            ws.send("usub,succ");
        } else {
            ws.send("usub,fail,cmdp");
        }
    }
);

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
