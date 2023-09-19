// Code Author: Adrian Ștefan

import { CrudService } from "./CrudService";

export abstract class GroupService<C, G> extends CrudService<C, G> {
    protected static readonly TABLE_NAME: string = 'group_table';
    protected static readonly LINK_TABLE_NAME: string = 'group_person_table';

    public abstract createGroupInfoResponse(group: G): Promise<Record<string, unknown>>;

    public abstract movePeopleToNewGroup(group_id: unknown, newGroup_id: unknown): Promise<number>;

    public abstract moveGroupToNewGroup(group_id: unknown, newParent_id: unknown): Promise<number>;
};
