// Code Author: Adrian Ștefan

import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import { Validator } from "../core/validator/Validator";
import { ValidatorResult } from "../core/types";

export class AjvValidator implements Validator {
    private _validator: Ajv;

    constructor(removeAdditional: boolean = true) {
        this._validator = new Ajv({
            allErrors: true,
            removeAdditional
        });

        ajvErrors(this._validator);
    }

    public addSchema(schema: unknown, key: string): void {
        this._validator.addSchema(schema, key);
    }

    public async validate(schema: string, data: unknown): Promise<ValidatorResult> {
        const validate = this._validator.getSchema(schema);

        if (typeof validate !== "function") {
            throw new Error(`Schema ${schema} not found`);
        }

        if (validate(data)) {
            return { valid: true };
        }

        return {
            valid: false,
            error: validate!.errors!.map(({ message }) => message).join("; ")
        };
    }
};
