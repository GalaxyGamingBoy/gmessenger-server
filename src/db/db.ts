const sqlite3 = require("sqlite3");

export const sendSQL = async (sql: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("gmessenger-db");

        db.serialize(() => {
            db.all(sql, (err, val) => {
                if (err) {
                    reject(err);
                }
                resolve(JSON.stringify(val));
            });
        });

        db.close();
    });
};
