// Code Author: Adrian Ștefan

import express from "express";
import cors from 'cors';
import { App } from "../core/app/app";
import { ValidateBodyHandler } from "../middleware/ValidateBodyHandler";
import { ValidateRequestHandler } from "../core/middleware/ValidateRequestHandler";
import { ValidateHeadersHandler } from "../middleware/ValidateHeadersHandler";
import { AuthMiddleware } from "../core/middleware/AuthHandler";
import { ValidateAuthTokenHandler } from "../middleware/ValidateAuthTokenHandler";
import { RouteMiddlewares, ServerDependencies } from "../types";
import { AuthRoutes } from "../routes/AuthRoutes";
import { PersonRoutes } from "../routes/PersonRoutes";
import { GroupRoutes } from "../routes/GroupRoutes";
import { HierarchyRoutes } from "../routes/HierarchyRoutes";

export class ServerApp<T, R, C, U, P, G, H> extends App {
    private _serverAppDependencies: ServerDependencies<T, R, C, U, P, G, H>;

    constructor(serverDependencies: ServerDependencies<T, R, C, U, P, G, H>) {
        super();
        this._serverAppDependencies = serverDependencies;
        this._setConfig();
    }

    protected _setConfig(): void {
        /* allow to receive requests with data in json format */
		this.app.use(express.json());

		/* enables cors */
		this.app.use(cors());

        const {
            validator,
            tokenHandler,
            errorHandler,
            authController,
            decorator,
            userService,
            personController,
            groupController,
            hierarchyController
        } = this._serverAppDependencies;

        /* add routes */
        const validateBodyHandler: ValidateRequestHandler = new ValidateBodyHandler(validator);
        const validateHeadersHandler: ValidateRequestHandler = new ValidateHeadersHandler(validator);
        const authMiddleware: AuthMiddleware = new ValidateAuthTokenHandler<T, C, U>(tokenHandler, decorator, userService);

        const routeMiddlewares: RouteMiddlewares = {
            validateBodyHandler,
            validateHeadersHandler,
            authMiddleware
        };

        /* auth routes */
        this.app.use('/auth/', new AuthRoutes<T, C, U>(routeMiddlewares, authController).getRouter());

        /* routes which handle person entries */
        this.app.use('/api/v1/persons/', new PersonRoutes(routeMiddlewares, personController).getRouter());

        /* routes which handle group entries */
        this.app.use('/api/v1/groups/', new GroupRoutes(routeMiddlewares, groupController).getRouter());

        /* routes which handle hierarchy entries */
        this.app.use('/api/v1/hierarchy/', new HierarchyRoutes(routeMiddlewares, hierarchyController).getRouter());

        /* add error handler - must be added as the last handler */
		this.app.use(errorHandler.handle.bind(errorHandler));
    }
};
