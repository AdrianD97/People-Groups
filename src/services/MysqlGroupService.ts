// Code Author: Adrian Ștefan

import { Connection, ResultSetHeader } from "mysql2/promise";
import { GroupService } from "../core/services/GroupService";
import { Group } from "../models/Group";
import { EventName } from "../types";

export class MysqlGroupService extends GroupService<Connection, Group> {
    public override async findById(id: number): Promise<Group | undefined> {
        const [rows] = await this.dbConnection.connection().execute<Group[]>(
            `SELECT * FROM ${GroupService.TABLE_NAME} WHERE id = ? limit 1`,
            [id]
        );

        if (!rows.length) {
            return undefined;
        }

        return rows[0];
    }

    public override async findAll(): Promise<Group[]> {
        const [rows] = await this.dbConnection.connection().execute<Group[]>(
            `SELECT * FROM ${GroupService.TABLE_NAME}`
        );

        return rows;
    }

    public override async create(data: Record<string, unknown>): Promise<Group> {
        const { name, parent_id } = data;
        let query: string = `INSERT INTO ${GroupService.TABLE_NAME} (name, parent_id) VALUES (?, ?)`;

        if (!parent_id) {
            query = `INSERT INTO ${GroupService.TABLE_NAME} (name) VALUES (?)`;
        }

        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            query,
            parent_id ? [name, parent_id] : [name]
        );
    
        this.emit(EventName.INVALIDATION);
        return this.findById(result.insertId);
    }

    public override async createGroupInfoResponse(group: Group): Promise<Record<string, unknown>> {
        return group;
    }

    public override async update(id: number, data: Record<string, unknown>): Promise<Group | undefined> {
        const { name } = data;
        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            `UPDATE ${GroupService.TABLE_NAME} SET name = ? WHERE id = ?`,
            [name, id]
        );

        if (!result.affectedRows) {
            return undefined;
        }
    
        this.emit(EventName.INVALIDATION);
        return this.findById(id);
    }

    public override async delete(id: number): Promise<number> {
        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            `DELETE FROM ${GroupService.TABLE_NAME} WHERE id = ?`,
            [id]
        );

        if (result.affectedRows) {
            this.emit(EventName.INVALIDATION);
        }

        return result.affectedRows;
    }

    public override async movePeopleToNewGroup(group_id: number, newGroup_id: number): Promise<number> {
        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            `UPDATE ${GroupService.LINK_TABLE_NAME} SET group_id = ? WHERE group_id = ?`,
            [newGroup_id, group_id]
        );

        if (result.affectedRows) {
            this.emit(EventName.INVALIDATION);
        }

        return result.affectedRows;
    }

    public override async moveGroupToNewGroup(group_id: number, newParent_id: number): Promise<number> {
        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            `UPDATE ${GroupService.TABLE_NAME} SET parent_id = ? WHERE id = ?`,
            (Number(newParent_id) === 0) ? [null, group_id] : [newParent_id, group_id]
        );

        if (result.affectedRows) {
            this.emit(EventName.INVALIDATION);
        }

        return result.affectedRows;
    }
};
