// Code Author: Adrian Ștefan

import { NextFunction, Request, Response } from 'express';
import { MESSAGE, STATUS_CODE } from '../core/types';
import { PersonController } from '../core/controllers/PersonController';
import { ServerError } from '../core/errors/ServerError';

export class PersonAppController<C, P> extends PersonController<C, P> {
    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { first_name, last_name, job, group_id } = req.body;
            const person: P = await this.personService.create({ first_name, last_name, job, group_id });

            res.status(STATUS_CODE.CREATED).json(await this.personService.createPersonInfoResponse(person));
        } catch (error) {
            next(error);
        }
    }

    public override async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { person_id } = req.params;
            const { first_name, last_name, job } = req.body;
            const person: P | undefined = await this.personService.update(person_id, { first_name, last_name, job });

            if (!person) {
                throw new ServerError(MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
            }

            res.status(STATUS_CODE.OK).json(await this.personService.createPersonInfoResponse(person));
        } catch (error) {
            next(error);
        }
    }

    public override async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { person_id } = req.params;
            const deletedNo = await this.personService.delete(person_id);

            if (!deletedNo) {
                throw new ServerError(MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
            }

            res.status(STATUS_CODE.OK).json({ message: MESSAGE.DELETED });
        } catch (error) {
            next(error);
        }
    }

    public override async addPersonToGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { person_id, group_id } = req.params;
            const person: P = await this.personService.addPersonToGroup(person_id, group_id);

            res.status(STATUS_CODE.OK).json(await this.personService.createPersonInfoResponse(person));
        } catch (error) {
            next(error);
        }
    }

    public override async deletePersonFromGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { person_id, group_id } = req.params;
            const deletedNo = await this.personService.deletePersonFromGroup(person_id, group_id);

            if (!deletedNo) {
                throw new ServerError(MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
            }

            res.status(STATUS_CODE.OK).json({ message: MESSAGE.DELETED });
        } catch (error) {
            next(error);
        }
    }
};
