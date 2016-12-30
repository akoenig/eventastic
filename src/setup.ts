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

import { Connection, dbCreate, db } from "rethinkdb";

export interface ISetupOptions {
    databaseName: string;
    tableName: string;
}

const setup = async (connection: Connection, {databaseName, tableName}: ISetupOptions) => {
    try {
        await dbCreate(databaseName).run(connection);
        await db(databaseName).tableCreate(tableName).run(connection);
    } catch (err) {
        if (err.message.indexOf(`already exists`) === -1) {
            throw new VError(err, `failed to ensure that the database has the correct structure`);
        }
    }
};

export default setup;
