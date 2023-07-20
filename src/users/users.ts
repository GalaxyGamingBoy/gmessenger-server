import { sendSQL } from "../db/db";
import { sessions } from "../session/session";

export const userExists = async (username: string): Promise<boolean> => {
    const existSQL = await sendSQL(
        `SELECT 'FOUND' FROM users WHERE username='${username}';`
    );

    return JSON.parse(existSQL).length > 0;
};

export const userSessionAuth = (username: string, session: string): boolean => {
    return (
        username &&
        session &&
        sessions.has(String(username)) &&
        sessions.get(String(username)).session ==
            Buffer.from(String(session), "base64").toString()
    );
};
