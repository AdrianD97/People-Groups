// Code Author: Adrian Ștefan

import { JwtPayload } from "jsonwebtoken";
import { Decorator } from "../core/decorators/Decorator";
import { ExtendedRequest } from "../types";

export class JwtDataDecorator implements Decorator<ExtendedRequest, JwtPayload> {
    public async decorate(req: ExtendedRequest, data: JwtPayload): Promise<void> {
        req.username = data.username;
    }
};
