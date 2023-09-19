// Code Author: Adrian Ștefan

import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
    id: number;
    username: string;
    password: string;
    role: number;
    created_at: Date;
};
