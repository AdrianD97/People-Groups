// Code Author: Adrian Ștefan

import { CrudService } from "./CrudService";

export abstract class PersonService<C, P> extends CrudService<C, P> {
    protected static readonly TABLE_NAME: string = 'person_table';
    protected static readonly LINK_TABLE_NAME: string = 'group_person_table';

    public abstract createPersonInfoResponse(person: P): Promise<Record<string, unknown>>;

    public abstract addPersonToGroup(person_id: unknown, group_id: unknown): Promise<P>;

    public abstract deletePersonFromGroup(person_id: unknown, group_id: unknown): Promise<number>;
};
