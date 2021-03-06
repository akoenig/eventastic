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

interface IReplayOptions {
    connection: Connection;
    databaseName: string;
    tableName: string;
}

const replay = ({connection, databaseName, tableName}: IReplayOptions) => async (callback: (event: IEvent<any>) => void) => {
    try {
        const events = await db(databaseName).table(tableName).orderBy("createdAt").run(connection);

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

                callback(event);
            } catch (err) {
                if (err.message.indexOf("No more rows in the cursor") === -1) {
                    throw new VError(err, `failed to perform projection`);
                }

                hasNext = false;
            }

        } while (hasNext);
    } catch (err) {
        throw new VError(err, `failed to replay all events`);
    }
};

export {
    IReplayOptions,
    replay as default,
};
