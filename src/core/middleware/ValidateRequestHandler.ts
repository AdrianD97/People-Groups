// Code Author: Adrian Ștefan

import { ServerError } from "../errors/ServerError";
import { STATUS_CODE, ValidatorResult } from "../types";
import { Validator } from "../validator/Validator";
import { Middleware } from "./Middleware";
import { NextFunction, RequestHandler } from "express";

export abstract class ValidateRequestHandler extends Middleware {
    protected validator: Validator;

    constructor (validator: Validator) {
        super();
        this.validator = validator;
    }

    protected async _validateData(schema: string, data: unknown, next: NextFunction): Promise<void> {
        const { valid, error }: ValidatorResult = await this.validator.validate(schema, data);
    
        if (valid) {
            return next();
        }

        next(new ServerError(error, STATUS_CODE.BAD_REQUEST));
    }

    public abstract validate(schema: string): RequestHandler;
};
