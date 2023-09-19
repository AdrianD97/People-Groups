// Code Author: Adrian Ștefan

import { RequestHandler } from 'express';
import { Routes } from './routes';
import { RouteMiddlewares } from '../types';
import { UserRole, ValidationSchema } from '../core/types';
import { GroupController } from '../core/controllers/GroupController';

export class GroupRoutes<C, G> extends Routes {
    private _groupController: GroupController<C, G>;

    constructor (routeMiddlewares: RouteMiddlewares, groupController: GroupController<C, G>) {
        super(routeMiddlewares);
        this._groupController = groupController;
        this.init();
    }

    protected override init(): void {
        const createGroupFunc: RequestHandler = this._groupController.create.bind(this._groupController);
        const updateGroupFunc: RequestHandler = this._groupController.update.bind(this._groupController);
        const deleteGroupFunc: RequestHandler = this._groupController.delete.bind(this._groupController);
        const movePeopleToNewGroupFunc: RequestHandler = this._groupController.movePeopleToNewGroup.bind(this._groupController);
        const moveGroupToNewGroupFunc: RequestHandler = this._groupController.moveGroupToNewGroup.bind(this._groupController);

        this.router.post('/', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN),
            this.validateBodyHandler.validate(ValidationSchema.CREATE_GROUP_ENTRY)
        ], createGroupFunc);

        this.router.put('/:group_id', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN),
            this.validateBodyHandler.validate(ValidationSchema.UPDATE_GROUP_ENTRY)
        ], updateGroupFunc);

        this.router.delete('/:group_id', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN)
        ], deleteGroupFunc);

        this.router.patch('/:group_id/move_people/:newGroup_id', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN)
        ], movePeopleToNewGroupFunc);

        this.router.patch('/:group_id/move_group/:newParent_id', [
            this.validateHeadersHandler.validate(ValidationSchema.AUTHORIZATION),
            this.checkAuthToken(),
            this.hasRole(UserRole.ADMIN)
        ], moveGroupToNewGroupFunc);
    }
};
