import { signal, effect, computed, Signal } from '@preact/signals-core';

export type StoreContext = {
    signal: <T>(initialValue: T) => Signal<T>;
    effect: typeof effect;
    computed: typeof computed;
};

export type StoreFunction<T = unknown> = (context: StoreContext) => T;

type StoreEntry<T = unknown> = {
    factory: StoreFunction<T>;
    instance?: T;
};

const storeRegistry: Record<string, StoreEntry<any>> = {};

export function defStore<T>(key: string, setup: StoreFunction<T>): void {
    if (storeRegistry[key]) {
        throw new Error(`Store "${key}" is already defined`);
    }

    storeRegistry[key] = {
        factory: setup
    };
}

export function resolveStore<T>(key: string): T {
    const entry = storeRegistry[key];
    if (!entry) {
        throw new Error(`Store "${key}" is not defined`);
    }

    if (!entry.instance) {
        entry.instance = entry.factory({
            signal,
            effect,
            computed
        });
    }

    return entry.instance as T;
}

export function resetStore(key: string): void {
    const entry = storeRegistry[key];
    if (!entry) return;

    entry.instance = undefined;
}

export function clearAllStores(): void {
    Object.keys(storeRegistry).forEach(key => {
        delete storeRegistry[key];
    });
}
