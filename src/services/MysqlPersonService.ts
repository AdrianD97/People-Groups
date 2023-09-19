// Code Author: Adrian Ștefan

import { Connection, ResultSetHeader } from "mysql2/promise";
import { PersonService } from "../core/services/PersonService";
import { Person } from "../models/Person";
import { EventName } from "../types";

export class MysqlPersonService extends PersonService<Connection, Person> {
    public override async findById(id: number): Promise<Person | undefined> {
        const [rows] = await this.dbConnection.connection().execute<Person[]>(
            `SELECT * FROM ${PersonService.TABLE_NAME} WHERE id = ? limit 1`,
            [id]
        );

        if (!rows.length) {
            return undefined;
        }

        return rows[0];
    }

    public override async findAll(): Promise<Person[]> {
        const [rows] = await this.dbConnection.connection().execute<Person[]>(
            `SELECT * FROM ${PersonService.TABLE_NAME}`
        );

        return rows;
    }

    public override async addPersonToGroup(person_id: number, group_id: number): Promise<Person> {
        await this.dbConnection.connection().execute<ResultSetHeader>(
            `INSERT INTO ${PersonService.LINK_TABLE_NAME} (group_id, person_id) VALUES (?, ?)`,
            [group_id, person_id]
        );

        /* Recreate hierarchy as a person was added to a group */
        this.emit(EventName.INVALIDATION);
        return this.findById(person_id);
    }

    public override async deletePersonFromGroup(person_id: number, group_id: number): Promise<number> {
        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            `DELETE FROM ${PersonService.LINK_TABLE_NAME} WHERE group_id = ? AND person_id = ?`,
            [group_id, person_id]
        );

        if (result.affectedRows) {
            /* Recreate hierarchy as a person was removed from a group */
            this.emit(EventName.INVALIDATION);
        }

        return result.affectedRows;
    }

    public override async create(data: Record<string, unknown>): Promise<Person> {
        const { first_name, last_name, job, group_id } = data;

        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            `INSERT INTO ${PersonService.TABLE_NAME} (first_name, last_name, job) VALUES (?, ?, ?)`,
            [first_name, last_name, job]
        );

        if (group_id) {
            return this.addPersonToGroup(result.insertId, group_id as number);
        }

        /* no need to recreate the hierarchy as the person hasn't been added to a group yet */
        return this.findById(result.insertId);
    }

    public override async createPersonInfoResponse(person: Person): Promise<Record<string, unknown>> {
        return person;
    }

    public override async update(id: number, data: Record<string, unknown>): Promise<Person | undefined> {
        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            this.prepareUpdateQuery(id, data)
        );

        if (!result.affectedRows) {
            return undefined;
        }
    
        this.emit(EventName.INVALIDATION);
        return this.findById(id);
    }

    private prepareUpdateQuery(id: number, data: Record<string, unknown>): string {
        const { first_name, last_name, job } = data;
        let query: string = `UPDATE ${PersonService.TABLE_NAME} SET `;

        if (first_name) {
            query += `first_name = '${first_name}'`;
        }

        if (last_name) {
            query += first_name ? `, last_name = '${data.last_name}'` : `last_name = '${data.last_name}'`;
        }

        if (job) {
            query += first_name || last_name ? `, job = '${data.job}'` : `job = '${data.job}'`;
        }

        query += ` WHERE id = ${id}`;
        return query;
    }

    public override async delete(id: number): Promise<number> {
        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            `DELETE FROM ${PersonService.TABLE_NAME} WHERE id = ?`,
            [id]
        );

        if (result.affectedRows) {
            this.emit(EventName.INVALIDATION);
        }

        return result.affectedRows;
    }
};
