// Code Author: Adrian Ștefan

export interface Encrypter {
    hash(content: string): Promise<string>;
    compare(content: string, hashedContent: string): Promise<boolean>;
};
