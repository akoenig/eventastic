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

import { Connection, connect } from "rethinkdb";

import { IEvent } from "./types";

import commit from "./commit";
import changes from "./changes";
import createEvent from "./event";
import project from "./project";
import createProjection, { IProjectionHandler, when } from "./projection";
import setup from "./setup";

export interface IEventStoreOptions {
    host: string;
    port: number;
    databaseName?: string;
    tableName?: string;
}

const createEventStore = async ({host, port, databaseName = "eventastic", tableName = "event"}: IEventStoreOptions) => {
    let connection: Connection;

    try {
        connection = await connect({ host, port });

        connection.on('close', () => {
            throw new VError(`The database server dropped connection`)
        });
    } catch (err) {
        connection.close();

        throw new VError(err, `failed to connect to database instance`);
    }

    try {
        await setup(connection, { databaseName, tableName });
    } catch (err) {
        connection.close();

        throw new VError(err, `failed to set up the database correctly`);
    }

    return {
        commit: commit({ connection, databaseName, tableName }),
        changes: changes({ connection, databaseName, tableName }),
        project: (projection: IProjectionHandler[], initialState: any[] | {}) => project({ connection, databaseName, tableName }, projection, initialState)
    };
};

export { createEvent, IEvent, createProjection, IProjectionHandler, when };
export default createEventStore;
