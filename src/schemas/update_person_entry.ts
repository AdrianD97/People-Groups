// Code Author: Adrian Ștefan

import { ValidationSchema } from "../core/types";
import { Utility } from "../utils/Utility";

export const UpdatePersonEntrySchema = {
    $id: ValidationSchema.UPDATE_PERSON_ENTRY,
    type: 'object',
    properties: {
        first_name: {
            type: 'string'
        },
        last_name: {
            type: 'string'
        },
        job: {
            type: 'string'
        }
    },
    additionalProperties: false,
    errorMessage: {
        properties: {
            first_name: Utility.createInvalidFieldTypeError('First Name', 'string'),
            last_name: Utility.createInvalidFieldTypeError('Last Name', 'string'),
            job: Utility.createInvalidFieldTypeError('Job', 'string')
        }
    }
};
