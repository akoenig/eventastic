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

import { IEvent } from "./types";

const createEvent = <T>(type: string) => (payload: T): IEvent<T> => ({
    type,
    payload
});

export default createEvent;
