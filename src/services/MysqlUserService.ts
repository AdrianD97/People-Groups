// Code Author: Adrian Ștefan

import { Connection, ResultSetHeader } from "mysql2/promise";
import { UserService } from "../core/services/UserService";
import { User } from "../models/User";
import { Config } from "../config/config";
import { UserRole } from "../core/types";

export class MysqlUserService<T> extends UserService<T, Connection, User> {
    public override async findById(id: number): Promise<User | undefined> {
        const [rows] = await this.dbConnection.connection().execute<User[]>(
            `SELECT * FROM ${UserService.TABLE_NAME} WHERE id = ? limit 1`,
            [id]
        );

        if (!rows.length) {
            return undefined;
        }

        return rows[0];
    }

    public override async findAll(): Promise<User[]> {
        const [rows] = await this.dbConnection.connection().execute<User[]>(
            `SELECT * FROM ${UserService.TABLE_NAME}`
        );

        return rows;
    }

    public override async create(data: Record<string, unknown>): Promise<User> {
        const { username, password, role } = data;

        const hashedPassword: string = await this.passwordEncrypter.hash(password as string);
        let query: string = `INSERT INTO ${UserService.TABLE_NAME} (username, password, role) VALUES (?, ?, ?)`;

        if (!role) {
            query = `INSERT INTO ${UserService.TABLE_NAME} (username, password) VALUES (?, ?)`;
        }

        const [result] = await this.dbConnection.connection().execute<ResultSetHeader>(
            query,
            role ? [username, hashedPassword, role] : [username, hashedPassword]
        );
    
        return this.findById(result.insertId);
    }

    public override async findByUsername(username: string): Promise<User | undefined> {
        const [rows] = await this.dbConnection.connection().execute<User[]>(
            `SELECT * FROM ${UserService.TABLE_NAME} WHERE username = ? limit 1`,
            [username]
        );

        if (!rows.length) {
            return undefined;
        }

        return rows[0];
    }

    public override cmpPassword(user: User, password: string): Promise<boolean> {
        return this.passwordEncrypter.compare(password, user.password);
    }

    public override async createLoginResponse(user: User): Promise<Record<string, unknown>> {
        return {
            accessToken: await this.tokenHandler.sign(
                { username: user.username },
                Config.get('SECRET_KEY') as string,
                { expiresIn: Config.get('EXPIRES_IN') as number }
            ),
            username: user.username,
            role: user.role,
            created_at: user.created_at
        };
    }

    public override async hasRole(user: User, role: UserRole): Promise<boolean> {
        return user.role === role;
    }
};
