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

export type Reducer = <S, P>(state: S, event: IEvent<P>) => S;

export interface IProjectionHandler {
    type: string; reducer: Reducer
};

export type Creator = (type: string, reducer: Reducer) => IProjectionHandler;

export type Projection = (...handler: IProjectionHandler[]) => IProjectionHandler[];

export const when: Creator = (type: string, reducer: Reducer) => ({
    type,
    reducer
});

const createProjection: Projection = (...handler: IProjectionHandler[]) => handler;

export default createProjection;
