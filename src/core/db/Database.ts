// Code Author: Adrian Ștefan

export abstract class Database<T> {
    public abstract connect(): Promise<void>;
    public abstract disconnect(): Promise<void>;
    public abstract connection(): T;
};
