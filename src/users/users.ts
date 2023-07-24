import { WebSocket } from "ws";
import { sendSQL } from "../db/db";

export const loggedUsers = new Map<string, WebSocket>();
export const userExists = async (username: string): Promise<boolean> => {
    const existSQL = await sendSQL(
        `SELECT 'FOUND' FROM users WHERE username='${username}';`
    );

    return JSON.parse(existSQL).length > 0;
};
