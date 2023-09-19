// Code Author: Adrian Ștefan

import { RequestHandler } from 'express';
import { Routes } from './routes';
import { RouteMiddlewares } from '../types';
import { HierarchyController } from '../core/controllers/HierarchyController';

export class HierarchyRoutes<R, C, H> extends Routes {
    private _hierarchyController: HierarchyController<R, C, H>;

    constructor (routeMiddlewares: RouteMiddlewares, authController: HierarchyController<R, C, H>) {
        super(routeMiddlewares);
        this._hierarchyController = authController;
        this.init();
    }

    protected override init(): void {
        const getHierarchyFunc: RequestHandler = this._hierarchyController.getHierarchy.bind(this._hierarchyController);
        const getAncestorsChainFunc: RequestHandler = this._hierarchyController.getAncestorsChain.bind(this._hierarchyController);
        const getGroupHierarchyFunc: RequestHandler = this._hierarchyController.getGroupHierarchy.bind(this._hierarchyController);



        this.router.get('/', getHierarchyFunc);

        this.router.get('/person/:person_id', getAncestorsChainFunc);

        this.router.get('/group/:group_id', getGroupHierarchyFunc);
    }
};
