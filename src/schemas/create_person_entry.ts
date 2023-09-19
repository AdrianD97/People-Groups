// Code Author: Adrian Ștefan

import { ValidationSchema } from "../core/types";
import { Utility } from "../utils/Utility";

export const CreatePersonEntrySchema = {
    $id: ValidationSchema.CREATE_PERSON_ENTRY,
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
        },
        group_id: {
            type: 'number'
        }
    },
    required: ['first_name', 'last_name', 'job'],
    additionalProperties: false,
    errorMessage: {
        required: {
            first_name: Utility.createMissingRequiredFieldError('First Name'),
            last_name: Utility.createMissingRequiredFieldError('Last Name'),
            job: Utility.createMissingRequiredFieldError('Job')
        },
        properties: {
            first_name: Utility.createInvalidFieldTypeError('First Name', 'string'),
            last_name: Utility.createInvalidFieldTypeError('Last Name', 'string'),
            job: Utility.createInvalidFieldTypeError('Job', 'string'),
            group_id: Utility.createInvalidFieldTypeError('Group ID', 'number')
        }
    }
};
