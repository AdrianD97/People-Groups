// Code Author: Adrian Ștefan

import { RequestHandler } from 'express';
import { Routes } from './routes';
import { RouteMiddlewares } from '../types';
import { UserRole, ValidationSchema } from '../core/types';
import { PersonController } from '../core/controllers/PersonController';

export class PersonRoutes<C, P> extends Routes {
    private _personController: PersonController<C, P>;

    constructor (routeMiddlewares: RouteMiddlewares, personController: PersonController<C, P>) {
        super(routeMiddlewares);
        this._personController = personController;
        this.init();
    }

    protected override init(): void {
        const createPersonFunc: RequestHandler = this._personController.create.bind(this._personController);
        const updatePersonFunc: RequestHandler = this._personController.update.bind(this._personController);
        const deletePersonFunc: RequestHandler = this._personController.delete.bind(this._personController);
        const addPersonToGroupFunc: RequestHandler = this._personController.addPersonToGroup.bind(this._personController);
        const deletePersonFromGroupFunc: RequestHandler = this._personController.deletePersonFromGroup.bind(this._personController);

        this.router.post('/', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN),
            this.validateBodyHandler.validate(ValidationSchema.CREATE_PERSON_ENTRY)
        ], createPersonFunc);

        this.router.put('/:person_id', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN),
            this.validateBodyHandler.validate(ValidationSchema.UPDATE_PERSON_ENTRY)
        ], updatePersonFunc);

        this.router.delete('/:person_id', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN)
        ], deletePersonFunc);

        this.router.patch('/:person_id/add/:group_id', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN)
        ], addPersonToGroupFunc);

        this.router.patch('/:person_id/remove/:group_id', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN)
        ], deletePersonFromGroupFunc);
    }
};
