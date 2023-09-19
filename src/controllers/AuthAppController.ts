import { NextFunction, Request, Response } from 'express';
import { MESSAGE, STATUS_CODE } from '../core/types';
import { AuthController } from '../core/controllers/AuthController';
// Code Author: Adrian Ștefan

import { ServerError } from '../core/errors/ServerError';

export class AuthAppController<T, C, U> extends AuthController<T, C, U> {
    public override async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password } = req.body;
            const user: U | undefined = await this.userService.findByUsername(username);

            if (!user) {
                throw new ServerError(
                    MESSAGE.INVALID_CREDENTIALS,
                    STATUS_CODE.WRONG_CREDENTIALS
                );
            }

            const passwordMatch: boolean = await this.userService.cmpPassword(user, password);

            if (!passwordMatch) {
                throw new ServerError(
                    MESSAGE.INVALID_CREDENTIALS,
                    STATUS_CODE.WRONG_CREDENTIALS
                );
            }

            res.status(STATUS_CODE.OK).json(await this.userService.createLoginResponse(user));
        } catch (error) {
            next(error);
        }
    }
};
