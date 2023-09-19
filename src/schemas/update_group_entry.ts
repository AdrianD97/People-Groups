// Code Author: Adrian Ștefan

import { ValidationSchema } from "../core/types";
import { Utility } from "../utils/Utility";

export const UpdateGroupEntrySchema = {
    $id: ValidationSchema.UPDATE_GROUP_ENTRY,
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
    },
    additionalProperties: false,
    errorMessage: {
        properties: {
            name: Utility.createInvalidFieldTypeError('Group Name', 'string')
        }
    }
};
