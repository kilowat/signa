import { ReadonlySignal } from '@preact/signals-core';
export declare class ComputedManager {
    private static maxCacheSize;
    private static cleanupThreshold;
    private static cacheTimeout;
    private static createCacheKey;
    private static sortObjectKeys;
    private static argsEqual;
    static createComputed<T, Args extends unknown[]>(fn: (...args: Args) => T, options?: {
        maxAge?: number;
        cacheSize?: number;
    }): (...args: Args) => T;
    private static cleanup;
}
export declare function createComputedProperty<T, Args extends unknown[]>(fn: (...args: Args) => T, options?: {
    maxAge?: number;
    cacheSize?: number;
}): (...args: Args) => T;
export type ComputedProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any ? ReadonlySignal<ReturnType<C[K]>> : never;
};
export type InferComputedType<T> = T extends (...args: any[]) => any ? ReturnType<T> : never;
