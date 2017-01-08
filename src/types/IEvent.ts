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

interface IEvent<Payload> {
    createdAt?: string;
    type: string;
    payload: Payload
}

export default IEvent;
