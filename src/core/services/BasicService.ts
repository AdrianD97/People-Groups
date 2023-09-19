// Code Author: Adrian Ștefan

import EventEmitter from "events";
import { Database } from "../db/Database";

export abstract class BasicService<C> extends EventEmitter {
    protected dbConnection: Database<C>;

    constructor(dbConnection: Database<C>) {
        super();
        this.dbConnection = dbConnection;
    }
};
