// Code Author: Adrian Ștefan

import { NextFunction, Request, Response } from "express";
import { MESSAGE, STATUS_CODE } from "../core/types";
import { ServerError } from "../core/errors/ServerError";
import { ErrorHandler } from "../core/middleware/ErrorHandler";

export class ServerErrorHandler extends ErrorHandler {
    public override handle(err: unknown, _: Request, res: Response, _next: NextFunction) {
        if (err) {
            console.error(err);

            let statusCode: number = STATUS_CODE.SERVER_ERROR;
            let message: string = MESSAGE.SERVER_ERROR;

            if (err instanceof ServerError) {
                statusCode = err.statusCode;
                message = err.message;
            }

            res.status(statusCode).json({ message });
        }
    }
};
