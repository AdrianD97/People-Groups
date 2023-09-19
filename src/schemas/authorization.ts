// Code Author: Adrian Ștefan

import { ValidationSchema } from "../core/types";
import { Utility } from "../utils/Utility";

export const AuthorizationSchema = {
    $id: ValidationSchema.AUTHORIZATION,
    type: 'object',
    properties: {
        authorization: {
            type: 'string',
            pattern: 'Bearer .+$'
        }
    },
    required: ['authorization'],
    errorMessage: {
        required: {
            authorization: Utility.createMissingRequiredFieldError('Authorization header')
        },
        properties: {
            authorization: Utility.createInvalidFieldTypeError('Authorization header', 'string')
        }
    }
};
