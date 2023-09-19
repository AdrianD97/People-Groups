// Code Author: Adrian Ștefan

import { Config } from "../config/config";
import { Database } from "../core/db/Database";
import { createClient, RedisClientType } from "redis";

export class RedisDatabase extends Database<RedisClientType> {
    private _connection: RedisClientType;

    constructor() {
        super();
        const url: string = `redis://${Config.get('CACHE_HOST')}:${Config.get('CACHE_PORT')}`;
        this._connection = createClient({ url, password: Config.get('CACHE_PASSWORD') as string });
    }

    public override async connect(): Promise<void> {
        await this._connection.connect();
    }

    public override async disconnect(): Promise<void> {
        if (!this._connection) { return; }

        await this._connection.disconnect();
    }

    public override connection(): RedisClientType {
        return this._connection;
    }
};
