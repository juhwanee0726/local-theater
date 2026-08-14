import { DB_PATH } from "#/config/config.js";
import { DatabaseSync, StatementSync } from "node:sqlite";
import logger from "#/util/logger.js";
import schema from "./schema.js";

const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA foreign_keys = ON;");
db.exec(schema);
logger.info(`[DB] Database is ready: path: ${DB_PATH}`);

export const prepareStatements = <T extends Record<string, string>>(sql: T) => {
    const result = {} as {
        [K in keyof T]: StatementSync
    };

    for (const key in sql) {
        result[key] = db.prepare(sql[key]);
    }

    logger.info("[DB] Prepared statements");
    return result;
}

export default db;