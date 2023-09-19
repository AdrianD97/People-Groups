// Code Author: Adrian Ștefan

import { RowDataPacket } from "mysql2";

export interface Person extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    job: string;
    created_at: Date;
    updated_at: Date;
};
