// Code Author: Adrian Ștefan

export type SignMethodType = (data: Record<string, unknown>, secret: string, options?: Record<string, unknown>) => Promise<string>;
export type VerifyMethodType<T> = (token: string, secret: string) => Promise<T>;

export interface TokenHandler<T> {
    sign: SignMethodType;
    verify: VerifyMethodType<T>;
};
