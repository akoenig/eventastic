# eventastic

[WIP] An event store on top of RethinkDB.

## Usage

```typescript
import createEventStore, { createEvent } from "eventastic";

const app = async () => {
    const es = await createEventStore({
        host: 'localhost',
        port: 32793
    });

    const user: IUser = {
        username: "akoenig",
        firstname: "André",
        lastname: "König",
        email: "andre.koenig@posteo.de",
        password: "e3b0c4....",
        salt: "852b85...."
    };

    const UserRegisteredEvent = createEvent<IUser>('UserRegisteredEvent');

    await es.commit(UserRegisteredEvent(user));
};
```

### Changefeed

`eventastic` comes with a changefeed implementation which allows for further processing the event after it has been persisted (e. g. publish to message broker, etc.).

```typescript
import createEventStore, { createEvent } from "eventastic";

const app = async() => {
    const es = await createEventStore({
        host: 'localhost',
        port: 32793
    });

    await es.changes((err: Error, event: IEvent<any>) => {
        if (err) {
            // Handle error ...
        }

        console.log(`A new event has been persisted: ${JSON.stringify(event)}.`);

        // Publish to message broker etc. ...
    });
};
```

### Projections

```typescript

import createEventStore from "eventastic";
import createProjection, { when } from "eventastic/projection";

const app = async() => {
    const es = await createEventStore({
        host: 'localhost',
        port: 32793
    });

    const UserCount = createProjection(
        when('UserRegisteredEvent', (count: number, event: IEvent<IUser>) => count++),
        when('UserUnregisteredEvent', (count: number, event: IEvent<IUser>) => count--)
    );

    const registeredUserCount = await es.project(UserCount);

    console.log(`We have ${registeredUserCount} user(s). Yay!`);
};
```

# License

MIT © [André König](http://andrekoenig.de)
