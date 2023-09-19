// Code Author: Adrian Ștefan

import { Database } from "../db/Database";
import { BasicService } from "./BasicService";

export abstract class HierarchyService<R, C, H> extends BasicService<C> {
    protected static readonly PERSON_TABLE_NAME: string = 'person_table';
    protected static readonly GROUP_TABLE_NAME: string = 'group_table';
    protected static readonly LINK_TABLE_NAME: string = 'group_person_table';
    protected cacheConnection: Database<R>;

    constructor(dbConnection: Database<C>, cacheConnection: Database<R>) {
        super(dbConnection);
        this.cacheConnection = cacheConnection;
    }

    public abstract saveHierarchy(): Promise<void>;
    public abstract getHierarchy(): Promise<H>;
    public abstract getAncestorsChain(person_id: unknown): Promise<string[][] | undefined>;
    public abstract getGroupHierarchy(group_id: unknown, filter?: Record<string, unknown>): Promise<H | undefined>;
};
