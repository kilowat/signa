import { effect, computed, Signal } from '@preact/signals-core';
export type StoreContext = {
    signal: <T>(initialValue: T) => Signal<T>;
    effect: typeof effect;
    computed: typeof computed;
};
export type StoreFunction<T = unknown> = (context: StoreContext) => T;
export declare function defStore<T>(key: string, setup: StoreFunction<T>): void;
export declare function resolveStore<T>(key: string): T;
export declare function resetStore(key: string): void;
export declare function clearAllStores(): void;
