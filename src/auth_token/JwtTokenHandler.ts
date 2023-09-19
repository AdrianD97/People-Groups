// Code Author: Adrian Ștefan

import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { promisify } from 'util';
import { SignMethodType, TokenHandler, VerifyMethodType } from '../core/auth_token/TokenHandler';

export class JwtTokenHandler implements TokenHandler<JwtPayload> {
    private _sign: SignMethodType;
    private _verify: VerifyMethodType<JwtPayload>;

    constructor() {
        this._sign = promisify(sign);
        this._verify = promisify(verify);
    }

    public sign(data: Record<string, string>, secret: string, options?: Record<string, unknown>): Promise<string> {
        return this._sign(data, secret, options);
    }

    public verify(token: string, secret: string): Promise<JwtPayload> {
        return this._verify(token, secret);
    }
};
