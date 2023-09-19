// Code Author: Adrian Ștefan

import { Request, Response, NextFunction, RequestHandler } from "express";
import { Middleware } from "./Middleware";
import { UserRole } from "../types";

export abstract class AuthMiddleware extends Middleware {
    public abstract checkToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    public abstract hasRole(role: UserRole): RequestHandler;
};
