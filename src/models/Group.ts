// Code Author: Adrian Ștefan

import { RowDataPacket } from "mysql2";

export interface Group extends RowDataPacket {
    id: number;
    name: string;
    parent_id: number;
    created_at: Date;
    updated_at: Date;
};
