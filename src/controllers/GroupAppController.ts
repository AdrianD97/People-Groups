import { NextFunction, Request, Response } from 'express';
// Code Author: Adrian Ștefan

import { MESSAGE, STATUS_CODE } from '../core/types';
import { GroupController } from '../core/controllers/GroupController';
import { ServerError } from '../core/errors/ServerError';

export class GroupAppController<C, G> extends GroupController<C, G> {
    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, parent_id } = req.body;
            const group: G = await this.groupService.create({ name, parent_id });

            res.status(STATUS_CODE.CREATED).json(await this.groupService.createGroupInfoResponse(group));
        } catch (error) {
            next(error);
        }
    }

    public override async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { group_id } = req.params;
            const { name, parent_id } = req.body;
            const group: G | undefined = await this.groupService.update(group_id, { name, parent_id });

            if (!group) {
                throw new ServerError(MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
            }

            res.status(STATUS_CODE.OK).json(await this.groupService.createGroupInfoResponse(group));
        } catch (error) {
            next(error);
        }
    }

    public override async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { group_id } = req.params;
            const deletedNo: number = await this.groupService.delete(group_id);

            if (!deletedNo) {
                throw new ServerError(MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
            }

            res.status(STATUS_CODE.OK).json({ message: MESSAGE.DELETED });
        } catch (error) {
            next(error);
        }
    }

    public override async movePeopleToNewGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { group_id, newGroup_id } = req.params;
            const movedNo: number = await this.groupService.movePeopleToNewGroup(group_id, newGroup_id);

            res.status(STATUS_CODE.OK).json({ movedNo });
        } catch (error) {
            next(error);
        }
    }

    public override async moveGroupToNewGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { group_id, newParent_id } = req.params;
            const movedNo: number = await this.groupService.moveGroupToNewGroup(group_id, newParent_id);

            if (!movedNo) {
                throw new ServerError(MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
            }

            res.status(STATUS_CODE.OK).json({ succes: true });
        } catch (error) {
            next(error);
        }
    }
};
