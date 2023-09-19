// Code Author: Adrian Ștefan

import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { GroupService } from "../services/GroupService";

export abstract class GroupController<C, G> extends Controller {
    protected groupService: GroupService<C, G>;

    constructor(groupService: GroupService<C, G>) {
        super();
        this.groupService = groupService;
    }

    public abstract create(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract update(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract delete(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract movePeopleToNewGroup(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract moveGroupToNewGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
};
