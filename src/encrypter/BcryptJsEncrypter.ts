// Code Author: Adrian Ștefan

import bycrypt from 'bcryptjs';
import { PasswordEncrypter } from "../core/encrypter/PasswordEncrypter";
import { Config } from '../config/config';

export class BcryptJsEncrypter implements PasswordEncrypter {
    public async hash(password: string): Promise<string> {
        const salt = await bycrypt.genSalt(Config.get('ROUNDS') as number);
        return await bycrypt.hash(password, salt);
    }

    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bycrypt.compare(password, hashedPassword);
    }
};
