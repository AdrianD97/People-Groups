// Code Author: Adrian Ștefan

import { RowDataPacket } from "mysql2";

export interface HierarchyRow extends RowDataPacket {
    group_id: number;
    group_name: string;
    ancestors: string | null;
    person_id: number;
    first_name: string;
    last_name: string;
    job: string;
};
