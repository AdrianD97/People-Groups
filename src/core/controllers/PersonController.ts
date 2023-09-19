// Code Author: Adrian Ștefan

import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { PersonService } from "../services/PersonService";

export abstract class PersonController<C, P> extends Controller {
    protected personService: PersonService<C, P>;

    constructor(personService: PersonService<C, P>) {
        super();
        this.personService = personService;
    }

    public abstract create(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract update(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract delete(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract addPersonToGroup(req: Request, res: Response, next: NextFunction): Promise<void>;

    public abstract deletePersonFromGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
};
