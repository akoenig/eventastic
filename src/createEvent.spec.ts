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

import test from "ava";

import createEvent from "./createEvent";
import { IEvent } from "./types";

interface ITestPayload {
    foo: string;
}

test("The event creator should be able to create a valid event object", t => {
    const event = createEvent<ITestPayload>("AnEvent")({
        foo: "bar"
    });

    t.deepEqual<IEvent<ITestPayload>>(event, {
        type: "AnEvent",
        payload: {
            foo: "bar"
        }
    });
});
