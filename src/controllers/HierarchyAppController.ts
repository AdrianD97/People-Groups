// Code Author: Adrian Ștefan

import { NextFunction, Request, Response } from 'express';
import { MESSAGE, STATUS_CODE } from '../core/types';
import { HierarchyController } from '../core/controllers/HierarchyController';
import { ServerError } from '../core/errors/ServerError';

export class HierarchyAppController<R, C, H> extends HierarchyController<R, C, H> {
    public override async getHierarchy(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const hierarchy: H = await this.hierarchyService.getHierarchy();

            res.status(STATUS_CODE.OK).json(hierarchy);
        } catch (error) {
            next(error);
        }
    }

    public override async getAncestorsChain(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { person_id } = req.params;
            const ancestors: string[][] | undefined = await this.hierarchyService.getAncestorsChain(person_id);

            if (!ancestors) {
                throw new ServerError(MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
            }

            res.status(STATUS_CODE.OK).json({ ancestors });
        } catch (error) {
            next(error);
        }
    }

    public override async getGroupHierarchy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { group_id } = req.params;
            const hierarchy: H | undefined = await this.hierarchyService.getGroupHierarchy(group_id, req.query);

            if (!hierarchy) {
                throw new ServerError(MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
            }

            res.status(STATUS_CODE.OK).json(hierarchy);
        } catch (error) {
            next(error);
        }
    }
};
