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

import { omit } from "lodash";
import { Connection, db } from "rethinkdb";

import { IEvent } from "./types";

interface RethinkChange {
    new_val: IEvent<any>;
}

export interface IChangesOptions {
    connection: Connection;
    databaseName: string;
    tableName: string;
}

const changes = ({connection, databaseName, tableName}: IChangesOptions) => async (callback: Function) => {
    const cursor = await db(databaseName).table(tableName).changes({
        includeInitial: false,
        includeStates: false,
        includeTypes: false,
        squash: false,
        includeOffsets: false,
        changefeedQueueSize: undefined
    }).run(connection);

    cursor.each((err, change: RethinkChange) => {
        if (err) {
            return callback(new VError(err, `cursor failure while consuming a change`));
        }

        // TODO: Investigate why the change object is sometimes empty.
        // see: https://github.com/akoenig/eventastic/issues/2
        if (Object.keys(change).length) {
            callback(null, omit(change.new_val, ["id"]));
        }
    });
};

export default changes;
