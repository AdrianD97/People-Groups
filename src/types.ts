// Code Author: Adrian Ștefan

import { TokenHandler } from "./core/auth_token/TokenHandler";
import { AuthController } from "./core/controllers/AuthController";
import { GroupController } from "./core/controllers/GroupController";
import { HierarchyController } from "./core/controllers/HierarchyController";
import { PersonController } from "./core/controllers/PersonController";
import { Decorator } from "./core/decorators/Decorator";
import { AuthMiddleware } from "./core/middleware/AuthHandler";
import { ErrorHandler } from "./core/middleware/ErrorHandler";
import { ValidateRequestHandler } from "./core/middleware/ValidateRequestHandler";
import { UserService } from "./core/services/UserService";
import { Validator } from "./core/validator/Validator";
import { Request } from "express";

export interface EnvVars {
    PORT: number;
    HOST: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    ROUNDS: number;
    SECRET_KEY: string;
    EXPIRES_IN: number;
    CACHE_HOST: string;
    CACHE_PORT: number;
    CACHE_PASSWORD: string;
};

export interface ExtendedRequest extends Request {
    username: string;
};

export type ServerDependencies<T, R, C, U, P, G, H> = {
    validator: Validator;
    tokenHandler: TokenHandler<T>;
    errorHandler: ErrorHandler;
    authController: AuthController<T, C, U>;
    personController: PersonController<C, P>;
    hierarchyController: HierarchyController<R, C, H>;
    groupController: GroupController<C, G>;
    decorator: Decorator<ExtendedRequest, T>;
    userService: UserService<T, C, U>;
};

export type RouteMiddlewares = {
    validateBodyHandler: ValidateRequestHandler;
    validateHeadersHandler: ValidateRequestHandler;
    authMiddleware: AuthMiddleware;
};

// enums
export enum EventName {
    INVALIDATION = 'invalidation'
};
