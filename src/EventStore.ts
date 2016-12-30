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

import { Connection, connect, dbCreate, db } from "rethinkdb";

import * as debug from "debug";

import * as EventEmitter from "events";

export interface IEventStoreOptions {
    host: string;
    port: number;
    user?: string;
    password?: string;
    databaseName: string;
    tableName: string;
}

class EventStore extends EventEmitter {

    private dbg: debug.IDebugger = debug('EventStore');
    private connection: Connection;

    constructor(private options: IEventStoreOptions) {
        super();
    }

    async connect() {
        const {host, port, user, password, databaseName, tableName} = this.options;

        try {
            this.connection = await connect({ host, port, user, password });
        } catch (err) {
            throw new VError(err, `failed to connect to RethinkDB instance`);
        }

        //
        // Ensure that the respective database and the event table exists
        //
        try {
            await dbCreate(databaseName).run(this.connection);
            await db(databaseName).tableCreate(tableName).run(this.connection);
        } catch (err) {
            this.dbg(`Database and table already exists.`);
        }

        this.connection.on('close', () => {
            this.emit('error', new VError(`RethinkDB connection lost.`));
        });
    }

    async commit<T>(event: T) {
        if (!this.connection) {
            throw new VError(`Unable to commit an event when there is no connection to the database. Connect first!`);
        }

        const { databaseName, tableName } = this.options;

        try {
            await db(databaseName).table(tableName).insert(event).run(this.connection);
        } catch (err) {
            throw new VError(err, `failed to insert event`);
        }
    }

    async changes(callback: Function) {
        const { databaseName, tableName } = this.options;

        const cursor = await db(databaseName).table(tableName).changes({
            includeInitial: false,
            includeStates: false,
            includeTypes: false,
            squash: false,
            includeOffsets: false,
            changefeedQueueSize: undefined
        }).run(this.connection);

        cursor.each((err, change) => {
            // TODO: Handle error

            callback(change);
        });
    }

    async disconnect() {
        await this.connection.close();

        this.connection = null;
    }
}

export default EventStore;
