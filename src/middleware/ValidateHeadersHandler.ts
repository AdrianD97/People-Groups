// Code Author: Adrian Ștefan

import { Request, Response, NextFunction, RequestHandler } from "express";
import { ValidateRequestHandler } from "../core/middleware/ValidateRequestHandler";

export class ValidateHeadersHandler extends ValidateRequestHandler {
    public override validate(schema: string): RequestHandler {
        return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
            await this._validateData(schema, req.headers, next);
        };
    }
};
