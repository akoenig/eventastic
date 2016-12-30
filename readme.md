# eventastic

An event store on top of RethinkDB.

## Usage

```typescript
import createEventStore, { createEvent } from "eventastic";

const app = async () => {

    const store = await createEventStore({
        host: '',
        port: 28015,
        user: '',
        password: ''
    });

    const UserRegisteredEvent = createEvent('UserRegisteredEvent');

    await store.commit(UserRegisteredEvent({name: 'André'}));
};
```

# License

MIT © [André König](http://andrekoenig.de)
