import { Signal, effect, computed } from '@preact/signals-core';
export type StoreContext = {
    signal: <T>(initialValue: T) => Signal<T>;
    effect: typeof effect;
    computed: typeof computed;
};
export type StoreFunction = (context: StoreContext) => unknown;
export declare function store(setup: StoreFunction): unknown;
