// Code Author: Adrian Ștefan

import { Response, NextFunction, RequestHandler } from "express";
import { MESSAGE, STATUS_CODE, UserRole } from "../core/types";
import { AuthMiddleware } from "../core/middleware/AuthHandler";
import { Config } from "../config/config";
import { TokenHandler } from "../core/auth_token/TokenHandler";
import { ServerError } from "../core/errors/ServerError";
import { Decorator } from "../core/decorators/Decorator";
import { ExtendedRequest } from "../types";
import { UserService } from "../core/services/UserService";

export class ValidateAuthTokenHandler<T, C, U> extends AuthMiddleware {
    private _tokenHandler: TokenHandler<T>;
    private _decorator: Decorator<ExtendedRequest, T>;
    private _userService: UserService<T, C, U>;

    constructor(tokenHandler: TokenHandler<T>, decorator: Decorator<ExtendedRequest, T>, userService: UserService<T, C, U>) {
        super();
        this._tokenHandler = tokenHandler;
        this._decorator = decorator;
        this._userService = userService;
    }

    public override async checkToken(req: ExtendedRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const token: string = req.headers.authorization.split(' ')[1];
            const decodeToken: T = await this._tokenHandler.verify(token, Config.get('SECRET_KEY') as string);
            await this._decorator.decorate(req, decodeToken);

            next();
        } catch (error) {
            console.error(error);
            next(new ServerError(MESSAGE.INVALID_AUTH_TOKEN, STATUS_CODE.UNAUTHORIZED));
        }
    }

    public override hasRole(role: UserRole): RequestHandler {
        return async (req: ExtendedRequest, _: Response, next: NextFunction): Promise<void> => {
            const user: U | undefined = await this._userService.findByUsername(req.username);
            const hasPermission: boolean = await this._userService.hasRole(user, role);

            if (!user || !hasPermission) {
                return next(new ServerError(MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED));
            }

            next();
        };
    }
};
