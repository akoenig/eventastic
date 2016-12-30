/*
 * eventastic
 *
 * Copyright(c) 2016 André König <andre.koenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André König (andre.koenig@posteo.de)
 *
 */

import VError = require("verror");

import { Connection, db } from "rethinkdb";

import { IEvent } from "./types";

export interface ICommitOptions {
    connection: Connection,
    databaseName: string;
    tableName: string;
}

const commit = ({connection, databaseName, tableName}: ICommitOptions) => async <T>(event: IEvent<T>) => {
    try {
        await db(databaseName).table(tableName).insert(event).run(connection);
    } catch (err) {
        throw new VError(err, `failed to commit event: ${JSON.stringify(event)}`);
    }
};

export default commit;
