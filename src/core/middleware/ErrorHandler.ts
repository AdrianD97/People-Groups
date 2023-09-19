// Code Author: Adrian Ștefan

import { NextFunction, Request, Response } from "express";
import { Middleware } from "./Middleware";

export abstract class ErrorHandler extends Middleware {
    public abstract handle(err: unknown, req: Request, res: Response, next: NextFunction): void;
};
