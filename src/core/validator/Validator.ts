// Code Author: Adrian Ștefan

import { ValidatorResult } from "../types";

export interface Validator {
    validate(schema: string, data: unknown): Promise<ValidatorResult>;
};
