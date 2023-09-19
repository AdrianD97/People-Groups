// Code Author: Adrian Ștefan

import { BasicService } from "./BasicService";

export abstract class CrudService<C, T> extends BasicService<C> {
    public abstract findById(id: unknown): Promise<T | undefined>;
    public abstract findAll(): Promise<T[]>;
    public abstract create(data: Record<string, unknown>): Promise<T>;
    public abstract update(id: unknown, data: Record<string, unknown>): Promise<T | undefined>;
    public abstract delete(id: unknown): Promise<number>;
};
