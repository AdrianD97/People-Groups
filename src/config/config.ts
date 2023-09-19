// Code Author: Adrian Ștefan

import * as dotnev from 'dotenv';
import { EnvVars } from "../types";

type EnvValueType = string | number | boolean;

export class Config {
    private static _CONFIGS: EnvVars;

    public static load(envFile: string = '.env'): void {
        dotnev.config({ path: envFile });

        Config._CONFIGS = {
            PORT: Number(process.env.PORT) || 3000,
            HOST: process.env.HOST || 'localhost',
            DB_HOST: process.env.DB_HOST || 'localhost',
            DB_PORT: Number(process.env.DB_PORT) || 3306,
            DB_NAME: process.env.DB_NAME || '',
            DB_USERNAME: process.env.DB_USERNAME || '',
            DB_PASSWORD: process.env.DB_PASSWORD || '',
            ROUNDS: Number(process.env.ROUNDS) || 10,
            SECRET_KEY: process.env.SECRET_KEY || '',
            EXPIRES_IN: Number(process.env.EXPIRES_IN) || 3600,
            CACHE_HOST: process.env.CACHE_HOST || 'localhost',
            CACHE_PORT: Number(process.env.CACHE_PORT) || 6379,
            CACHE_PASSWORD: process.env.CACHE_PASSWORD || ''
        };
    }

    public static get(key: string): EnvValueType {
        return Config._CONFIGS[key];
    }
};