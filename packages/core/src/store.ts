import { Signal, signal, effect, computed } from '@preact/signals-core';

export type StoreContext = {
    signal: <T>(initialValue: T) => Signal<T>;
    effect: typeof effect;
    computed: typeof computed;
};

export type StoreFunction = (context: StoreContext) => unknown;

export function createStore(setup: StoreFunction) {
    const storeContext: StoreContext = {
        signal,
        effect,
        computed
    };

    return setup(storeContext);
}