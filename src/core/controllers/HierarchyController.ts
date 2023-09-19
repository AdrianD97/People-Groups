// Code Author: Adrian Ștefan

import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { HierarchyService } from "../services/HierarchyService";

export abstract class HierarchyController<R, C, H> extends Controller {
    protected hierarchyService: HierarchyService<R, C, H>;

    constructor(hierarchyService: HierarchyService<R, C, H>) {
        super();
        this.hierarchyService = hierarchyService;
    }

    public abstract getHierarchy(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract getAncestorsChain(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract getGroupHierarchy(req: Request, res: Response, next: NextFunction): Promise<void>;
};
