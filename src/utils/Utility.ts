// Code Author: Adrian Ștefan

export class Utility {
    public static createMissingRequiredFieldError(field: string): string {
        return `Mandatory property is missing - ${field} is required`;
    }

    public static createInvalidFieldTypeError(field: string, type: string): string {
        return `Value not supported - ${field} must be a/an ${type}`;
    }
};
