import uuid4 from "uuid4";
import { sendSQL } from "../db/db";

export const sessions = new Map<
    string,
    { session: string; client: WebSocket }
>();

export const createSession = (username: string, ws: WebSocket): string => {
    const uuid = uuid4();
    sessions.set(username, { session: uuid, client: ws });
    return Buffer.from(uuid).toString("base64");
};

export const channelExist = async (name: string): Promise<boolean> => {
    const existSQL = await sendSQL(
        `SELECT 'FOUND' FROM channels WHERE name='${name}';`
    );

    return JSON.parse(existSQL).length > 0;
};
