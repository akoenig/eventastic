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

import VError = require('verror');

import { Connection, db } from "rethinkdb";

import { IEvent } from "./types";
import { IProjectionHandler } from "./createProjection";

export interface IProjectOptions {
    connection: Connection;
    databaseName: string;
    tableName: string;
};

const project = async <State>(options: IProjectOptions, projection: IProjectionHandler[], initialState: State): Promise<State> => {
    const {connection, databaseName, tableName} = options;

    const events = await db(databaseName).table(tableName).orderBy("createdAt").run(connection);

    let state = initialState;
    let hasNext = true;

    do {
        try {
            const event = await new Promise<IEvent<any>>((resolve, reject) => {
                events.next<IEvent<any>>((err: Error, event) => {
                    if (err) {
                        return reject(new VError(err, `failed to read an event from the store`));
                    }

                    resolve(event);
                });
            });

            projection
                .filter(handler => event.type === handler.type)
                .forEach(handler => {
                    state = handler.reducer(state, event);
                });
        } catch (err) {
            if (err.message.indexOf("No more rows in the cursor") === -1) {
                throw new VError(err, `failed to perform projection`);
            }

            hasNext = false;
        }

    } while (hasNext);

    return state;
};

export default project;
