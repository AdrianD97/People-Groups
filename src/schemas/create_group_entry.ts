// Code Author: Adrian Ștefan

import { ValidationSchema } from "../core/types";
import { Utility } from "../utils/Utility";

export const CreateGroupEntrySchema = {
    $id: ValidationSchema.CREATE_GROUP_ENTRY,
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        parent_id: {
            type: 'integer'
        }
    },
    required: ['name'],
    additionalProperties: false,
    errorMessage: {
        required: {
            name: Utility.createMissingRequiredFieldError('Group Name')
        },
        properties: {
            name: Utility.createInvalidFieldTypeError('Group Name', 'string'),
            parent_id: Utility.createInvalidFieldTypeError('Parent ID', 'integer')
        }
    }
};
