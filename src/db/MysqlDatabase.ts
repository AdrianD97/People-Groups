// Code Author: Adrian Ștefan

import { Config } from "../config/config";
import { Database } from "../core/db/Database";
import { Connection, createConnection } from "mysql2/promise";

export class MysqlDatabase extends Database<Connection> {
    private _connection: Connection;

    public override async connect(): Promise<void> {
        this._connection = await createConnection({
            host: Config.get('DB_HOST') as string,
            port: Config.get('DB_PORT') as number,
            user: Config.get('DB_USERNAME') as string,
            password: Config.get('DB_PASSWORD') as string,
            database: Config.get('DB_NAME') as string
        });
    }

    public override async disconnect(): Promise<void> {
        if (!this._connection) { return; }

        await this._connection.end();
    }

    public override connection(): Connection {
        return this._connection;
    }
};
