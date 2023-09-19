// Code Author: Adrian Ștefan

import { ValidationSchema } from "../core/types";
import { Utility } from "../utils/Utility";

export const LoginSchema = {
    $id: ValidationSchema.LOGIN,
    type: 'object',
    properties: {
        username: {
            type: 'string'
        },
        password: {
            type: 'string',
            minLength: 8
        },
    },
    required: ['username', 'password'],
    additionalProperties: false,
    errorMessage: {
        required: {
            username: Utility.createMissingRequiredFieldError('Username'),
            password: Utility.createMissingRequiredFieldError('Password')
        },
        properties: {
            username: Utility.createInvalidFieldTypeError('Username', 'string'),
            password: Utility.createInvalidFieldTypeError('Password', 'string with at least 8 characters')
        }
    }
};
