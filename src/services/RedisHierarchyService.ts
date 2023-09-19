// Code Author: Adrian Ștefan

import { RedisClientType } from "redis";
import { HierarchyService } from "../core/services/HierarchyService";
import { Connection } from "mysql2/promise";
import { HierarchyRow } from "../models/HierarchyRow";
import { Database } from "../core/db/Database";
import redisLock from "redis-lock";

export class RedisHierarchyService extends HierarchyService<RedisClientType, Connection, Record<string, unknown>> {
    private static readonly LOCK_NAME: string = "hierarchy";
    private _lock: (lockName: string, ttl?: number) => Promise<() => Promise<void>>;

    constructor(db: Database<Connection>, cache: Database<RedisClientType>) {
        super(db, cache);
        this._lock = redisLock(cache.connection());
    }

    public override async saveHierarchy(): Promise<void> {
        const [rows] = await this.dbConnection.connection().execute<HierarchyRow[]>(
            this._prepareQuery()
        );

        await this._executeUnderLock(async () => {
            console.log("Saving hierarchy...");
            /* delete all keys except the lock key */
            await this._flushCache();

            /* save the hierarchy to cache */
            await this._createHierarchy(rows);
            console.log("Hierarchy saved.");
        });
        
    }

    public override async getHierarchy(): Promise<Record<string, unknown>> {
        /**
         * Make sure no cache invalidation is in progress.
         * 
         * This solution is not 100% safe as it is possible a new invalidation could
         * be triggered while the hierarchy is read.
         */
        await this._executeUnderLock();
        const hierarchy: Record<string, unknown> = {};
        const keys: string[] = await this.cacheConnection.connection().keys("[G]-[1-9]*");
        const promises: Promise<void>[] = [];

        for (const key of keys) {
            if (key.indexOf("children") !== -1) {
                continue;
            }

            promises.push(this._computeHierarchyForGroup(hierarchy, key));
        }

        await Promise.all(promises);

        return hierarchy;
    }

    public override async getAncestorsChain(person_id: number): Promise<string[][] | undefined> {
        /**
         * Make sure no cache invalidation is in progress.
         * 
         * This solution is not 100% safe as it is possible a new invalidation could
         * be triggered while the hierarchy is read.
         */
        await this._executeUnderLock();
        const personKey: string = this._createKey("P", person_id);
        const person: Record<string, unknown> = await this.cacheConnection.connection().hGetAll(personKey);

        if (!Object.keys(person).length) {
            return undefined;
        }
    
        const personParentsKey: string = this._createKey("P", person_id, "parents");
        const parents: string[] = await this.cacheConnection.connection().sMembers(personParentsKey);

        if (!parents.length) {
            return [];
        }

        const promises: Promise<string[]>[] = [];
        const ancestors: string[][] = [];

        for (let i = 0; i < parents.length; ++i) {
            ancestors.push([]);
            promises.push(this._computeAncestorsChain(ancestors[i], parents[i]));
        }

        await Promise.all(promises);
        return ancestors;
    }

    public override async getGroupHierarchy(group_id: number, filter?: Record<string, unknown>): Promise<Record<string, unknown> | undefined> {
        /**
         * Make sure no cache invalidation is in progress.
         * 
         * This solution is not 100% safe as it is possible a new invalidation could
         * be triggered while the hierarchy is read.
         */
        await this._executeUnderLock();
        const groupKey: string = this._createKey("G", group_id);
        const group: Record<string, unknown> = await this.cacheConnection.connection().hGetAll(groupKey);

        if (!Object.keys(group).length) {
            return undefined;
        }

        const groupKeyName: string = `${group["group_name"]} - ${groupKey}`;
        const hierarchy: Record<string, unknown> = {
            [groupKeyName]: {}
        };

        await this._computeChildren(hierarchy[groupKeyName] as Record<string, unknown>, groupKey, filter);
        return hierarchy;
    }

    private async _computeHierarchyForGroup(hierarchy: Record<string, unknown>, groupKey: string): Promise<void> {
        const group: Record<string, unknown> = await this.cacheConnection.connection().hGetAll(groupKey);

        if (!group.parent_id) {
            const groupKeyName: string = `${group.group_name as string} - ${groupKey}`;
            hierarchy[groupKeyName] = {};
            await this._computeChildren(hierarchy[groupKeyName] as Record<string, unknown>, groupKey);
        }
    }

    private async _computeChildren(hierarchy: Record<string, unknown>, groupKey: string, filter?: Record<string, unknown>): Promise<void> {
        const children: string[] = await this.cacheConnection.connection().sMembers(`${groupKey}-children`);

        if (!children.length) {
            return;
        }

        let hasMembers: boolean = false;
        const multi = this.cacheConnection.connection().multi();
        const promises: Promise<void>[] = [];

        for (const childKey of children) {
            if (childKey.indexOf("P") !== -1) {
                hasMembers = true;
                multi.hGetAll(childKey);
            } else {
                promises.push(this._computeChildrenForChildGroup(hierarchy, childKey, filter));
            }
        }

        if (hasMembers) {
            const members = await multi.exec();
            hierarchy["members"] = [];
            for (const member of members) {
                if (this._personMatchFilter(member as unknown as Record<string, unknown>, filter)) {
                    (hierarchy["members"] as string[]).push(`${member["first_name"]} ${member["last_name"]} (${member["job"]}) - P-${member["person_id"]}`);
                }
            }
        }

        await Promise.all(promises);
    }

    private async _computeChildrenForChildGroup(hierarchy: Record<string, unknown>, childGroupKey: string, filter?: Record<string, unknown>): Promise<void> {
        const group: Record<string, unknown> = await this.cacheConnection.connection().hGetAll(childGroupKey);
        const groupKeyName: string = `${group.group_name as string} - ${childGroupKey}`;
        hierarchy[groupKeyName] = {};
        await this._computeChildren(hierarchy[groupKeyName] as Record<string, unknown>, childGroupKey, filter); 
    }

    private _personMatchFilter(member: Record<string, unknown>, filter?: Record<string, unknown>): boolean {
        if (!filter) {
            return true;
        }

        for (const [key, value] of Object.entries(filter)) {
            if (member[key] !== value) {
                return false;
            }
        }

        return true;
    }

    private async _computeAncestorsChain(ancestors: string[], groupKey: string): Promise<string[]> {
        const group: Record<string, unknown> = await this.cacheConnection.connection().hGetAll(groupKey);
        ancestors.push(`${group["group_name"]} - ${groupKey}`);

        if (!group.parent_id) {
            return;
        }

        await this._computeAncestorsChain(ancestors, this._createKey("G", group.parent_id as number));
    }

    private _prepareQuery(): string {
        return `WITH RECURSIVE cte AS (
                SELECT id, name, parent_id, 1 lvl FROM ${HierarchyService.GROUP_TABLE_NAME} AS group_table
                UNION ALL
                SELECT cte.id, cte.name, group_table.parent_id, lvl + 1
                FROM cte
                INNER JOIN group_table ON group_table.id = cte.parent_id
            )
            SELECT tmp.id AS group_id,
                   tmp.name AS group_name,
                   tmp.ancestors AS ancestors,
                   person_table.id AS person_id,
                   person_table.first_name AS first_name,
                   person_table.last_name AS last_name,
                   person_table.job AS job
            FROM
                (SELECT id, ANY_VALUE(name) AS name,
                GROUP_CONCAT(parent_id ORDER BY lvl) AS ancestors
                FROM cte
                GROUP BY id) AS tmp
            LEFT JOIN ${HierarchyService.LINK_TABLE_NAME} AS group_person_table ON group_person_table.group_id = tmp.id
            LEFT JOIN ${HierarchyService.PERSON_TABLE_NAME} person_table ON group_person_table.person_id = person_table.id`;
    }

    private async _executeUnderLock(func?: () => Promise<void>): Promise<void> {
        const done: () => Promise<void> = await this._lock(RedisHierarchyService.LOCK_NAME);
        if (func) {
            await func();
        }

        await done();
    }

    private async _flushCache(): Promise<void> {
        /**
         * We can't use flushdb/flushall as these commands will remove the lock key as well.
         */
        const keys: string[] = await this.cacheConnection.connection().keys("[GP]-[1-9]*");

        if (!keys.length) {
            console.log("No keys to delete.");
            return;
        }

        console.log(`Deleting ${keys.length} keys...`);
        await this.cacheConnection.connection().del(keys);
    }

    private async _createHierarchy(rows: HierarchyRow[]): Promise<void> {
        for (const row of rows) {
            /* https://redis.io/docs/interact/transactions/ */
            const multi = this.cacheConnection.connection().multi();
            const groupKey: string = this._createKey("G", row.group_id);
            let shouldAddGroup: boolean = await this.cacheConnection.connection().exists(groupKey) === 0;
            let groupChildrenKey: string | null = null;
            let personKey: string | null = null;
            let shouldAddPerson: boolean = false;
            let parentGroupChildrenKey: string | null = null;
            let personParentsKey: string | null = null;
            let parent_id: number | null = null;

            if (row.person_id) {
                personKey = this._createKey("P", row.person_id);
                groupChildrenKey = this._createKey("G", row.group_id, "children");
                personParentsKey = this._createKey("P", row.person_id, "parents");
                shouldAddPerson = await this.cacheConnection.connection().exists(personKey) === 0;
            }

            if (row.ancestors) {
                parent_id = Number(row.ancestors.split(",")[0]);
                parentGroupChildrenKey = this._createKey("G", parent_id, "children");
            }

            /* add a group if it do not exists */
            if (shouldAddGroup) {
                multi.hSet(groupKey, {
                    group_name: row.group_name,
                    group_id: row.group_id,
                    parent_id: parent_id ?? ""
                });
            }

            /* add a person if it not already added */
            if (shouldAddPerson) {
                multi.hSet(personKey, {
                    person_id: row.person_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    job: row.job
                });
            }

            /* add the person to the group's children */
            if (groupChildrenKey) {
                multi.sAdd(groupChildrenKey, personKey);
            }

            /* add the group to the person's parents */
            if (personParentsKey) {
                multi.sAdd(personParentsKey, groupKey);
            }

            /* add the group into the parent's children (if it has a parent) */
            if (parentGroupChildrenKey) {
                multi.sAdd(parentGroupChildrenKey, groupKey);
            }

            await multi.exec();
        }
    }

    private _createKey(prefix: string, id: number, addStr?: string): string {
        return `${prefix}-${id}${addStr ? `-${addStr}` : ""}`;
    }
};
