// Code Author: Adrian Ștefan

import { RequestHandler } from 'express';
import { Routes } from './routes';
import { RouteMiddlewares } from '../types';
import { AuthController } from '../core/controllers/AuthController';
import { ValidationSchema } from '../core/types';

export class AuthRoutes<T, C, U> extends Routes {
    private _authController: AuthController<T, C, U>;

    constructor (routeMiddlewares: RouteMiddlewares, authController: AuthController<T, C, U>) {
        super(routeMiddlewares);
        this._authController = authController;
        this.init();
    }

    protected override init(): void {
        const loginFunc: RequestHandler = this._authController.login.bind(this._authController);

        this.router.post('/login', [this.validateBodyHandler.validate(ValidationSchema.LOGIN)], loginFunc);
    }
};
