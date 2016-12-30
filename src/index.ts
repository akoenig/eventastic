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

import EventStore from "./EventStore";

interface IOptions {
    host: string;
    port: number;
}

interface IEvent<T> {
    type: string;
    payload: T;
}

interface IUser {
    firstname: string;
    lastname: string;
}

const app = async ({host, port}: IOptions) => {

    const es = new EventStore({
        host,
        port,
        databaseName: "eventastic",
        tableName: "event"
    });

    await es.connect();

    const events = [];

    es.changes((event: any) => {
        events.push(event);

        console.log(event)
        console.log('event length', events.length);
    });

    for (let i = 0; i < 100; i++) {
        const user: IUser = {
            firstname: "André " + new Date().toISOString(),
            lastname: "König"
        };

        const event: IEvent<IUser> = {
            type: "UserRegisteredEvent",
            payload: user
        };
        console.log(i);

        await es.commit<IEvent<IUser>>(event);
    }

    // console.log('Persisted');

    // setTimeout(async () => {

    //     for (let i = 0; i < 100; i++) {
    //         const user: IUser = {
    //             firstname: "André " + new Date().toISOString(),
    //             lastname: "König"
    //         };

    //         const event: IEvent<IUser> = {
    //             type: "UserRegisteredEvent",
    //             payload: user
    //         };

    //         await es.commit<IEvent<IUser>>(event);
    //     }

    //     console.log('Persisted second batch');
    // }, 5000);
    //     const connection = await connect({ host, port });

    //     console.log(connection);

    //     /*
    // conn.on('error', function(err) {
    //     // conn dropped
    //   })
    //     */

    //     connection.on('close', () => {
    //         throw new Error();
    //     });

    //     connection.on('error', (err: Error) => {
    //         console.log(`Received an error`);
    //     });

    //     try {
    //         await dbCreate('eventastic').run(connection);

    //         await db('eventastic').tableCreate('event').run(connection);
    //     } catch (err) {
    //         console.log('FOOOEERRRR!!')
    //     }

    //     connection.on('error', (err: Error) => {
    //         throw err;
    //     });

    // TODO: Close connection
};

app({ host: 'localhost', port: 32793 }).catch(err => console.error(err));
