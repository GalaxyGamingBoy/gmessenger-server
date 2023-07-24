import { sendSQL } from "../db/db";

export const channelsPerUser = new Map<string, Array<string>>();

export const loadChannels = async () => {
    const query: Array<{ username: string; channels: string }> = JSON.parse(
        await sendSQL("SELECT username, channels FROM users;")
    );
    
    query.forEach(user => {
        channelsPerUser.set(user.username, JSON.parse(user.channels))
    })
};

export const channelExist = async (name: string): Promise<boolean> => {
    const existSQL = await sendSQL(
        `SELECT 'FOUND' FROM channels WHERE name='${name}';`
    );

    return JSON.parse(existSQL).length > 0;
};
