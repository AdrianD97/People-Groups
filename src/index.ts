// Code Author: Adrian Ștefan

import { ValidationSchema } from "./core/types";
import { Validator } from "./core/validator/Validator";
import { AjvValidator } from "./validator/AjvValidator";
import {
    AuthorizationSchema,
    CreateGroupEntrySchema,
    CreatePersonEntrySchema,
    LoginSchema,
    UpdateGroupEntrySchema,
    UpdatePersonEntrySchema
} from "./schemas";
import { Config } from "./config/config";
import { JwtTokenHandler } from "./auth_token/JwtTokenHandler";
import { EventName, ServerDependencies } from "./types";
import { JwtPayload } from "jsonwebtoken";
import { ServerErrorHandler } from "./middleware/ServerErrorHandler";
import { AuthAppController } from "./controllers/AuthAppController";
import { ServerApp } from "./app/ServerApp";
import { MysqlDatabase } from "./db/MysqlDatabase";
import { MysqlUserService } from "./services/MysqlUserService";
import { Connection } from "mysql2/promise";
import { User } from "./models/User";
import { BcryptJsEncrypter } from "./encrypter/BcryptJsEncrypter";
import { JwtDataDecorator } from "./decorators/JwtDataDecorator";
import { Person } from "./models/Person";
import { PersonAppController } from "./controllers/PersonAppController";
import { MysqlPersonService } from "./services/MysqlPersonService";
import { Group } from "./models/Group";
import { GroupAppController } from "./controllers/GroupAppController";
import { MysqlGroupService } from "./services/MysqlGroupService";
import { RedisDatabase } from "./db/RedisDatabase";
import { RedisHierarchyService } from "./services/RedisHierarchyService";
import { RedisClientType } from "redis";
import { HierarchyAppController } from "./controllers/HierarchyAppController";

class Server {
    public static async start(): Promise<void> {
        Config.load();
        const port: number = Config.get('PORT') as number;
        const host: string = Config.get('HOST') as string;
        const db: MysqlDatabase = new MysqlDatabase();
        const cache: RedisDatabase = new RedisDatabase();
        const passwordEncrypter: BcryptJsEncrypter = new BcryptJsEncrypter();
        const jwtTokenHandler: JwtTokenHandler = new JwtTokenHandler();
        const userService: MysqlUserService<JwtPayload> = new MysqlUserService<JwtPayload>(db, passwordEncrypter, jwtTokenHandler);
        const hierarchyService: RedisHierarchyService = new RedisHierarchyService(db, cache);
        const listener: (...args: unknown[]) => Promise<void> = async () => {
            /**
             * OBS: A more efficient solution would be to use worker threads
             * as the hierarchy could be very large.
             * 
             * Currently, the hierarchy is invalidated each time a write operation is performed,
             * which is not very efficient. You may think of a better solution.
             */
            try {
                await hierarchyService.saveHierarchy();
            } catch (err: unknown) {
                console.error("Failed to create the hierarchy :: ", err);
            }
        };
        const personService: MysqlPersonService = new MysqlPersonService(db);
        personService.on(EventName.INVALIDATION, listener);
        const groupService: MysqlGroupService = new MysqlGroupService(db);
        groupService.on(EventName.INVALIDATION, listener);

        const serverDependencies: ServerDependencies<JwtPayload, RedisClientType, Connection, User, Person, Group, Record<string, unknown>> = {
            validator: Server._getValidator(),
            tokenHandler: jwtTokenHandler,
            errorHandler: new ServerErrorHandler(),
            authController: new AuthAppController<JwtPayload, Connection, User>(userService),
            decorator: new JwtDataDecorator(),
            userService,
            personController: new PersonAppController<Connection, Person>(personService),
            groupController: new GroupAppController<Connection, Group>(groupService),
            hierarchyController: new HierarchyAppController<RedisClientType, Connection, Record<string, unknown>>(hierarchyService)
        };

        try {
            await db.connect();
            await cache.connect();

            /**
             * Use the following two lines to create an admin user and a non admin user in the database.
             * When start the server for the first time, uncomment the following lines,
             * then make sure to comment them if restart the server.
             */
            // await userService.create({ username: "adrian", password: "password" });
            // await userService.create({ username: "daniel", password: "password", role: 1 });


            /* init cache */
            await hierarchyService.saveHierarchy();

            await new ServerApp<JwtPayload, RedisClientType, Connection, User, Person, Group, Record<string, unknown>>(serverDependencies).start(port, host);
        } catch (err: unknown) {
            console.error('Server failed to start :: ', err);
            await db.disconnect();
            await cache.disconnect();
            process.exit(1);
        }
    }

    private static _getValidator(): Validator {
        const validator: AjvValidator = new AjvValidator();
        validator.addSchema(LoginSchema, ValidationSchema.LOGIN);
        validator.addSchema(AuthorizationSchema, ValidationSchema.AUTHORIZATION);
        validator.addSchema(CreatePersonEntrySchema, ValidationSchema.CREATE_PERSON_ENTRY);
        validator.addSchema(UpdatePersonEntrySchema, ValidationSchema.UPDATE_PERSON_ENTRY);
        validator.addSchema(CreateGroupEntrySchema, ValidationSchema.CREATE_GROUP_ENTRY);
        validator.addSchema(UpdateGroupEntrySchema, ValidationSchema.UPDATE_GROUP_ENTRY);

        return validator;
    }
};

Server.start();
