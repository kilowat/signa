//store.js
import { signal, effect, computed } from '@preact/signals-core';
import { inject, provide } from './registry.js';

const storeRegistry = {};

export function defStore(key, setup) {
    if (storeRegistry && storeRegistry[key]) {
        throw new Error(`Store "${key}" is already defined`);
    }

    storeRegistry[key] = {
        factory: setup
    };
}

export function resolveStore(key) {
    const entry = storeRegistry[key];
    if (!entry) {
        throw new Error(`Store "${key}" is not defined`);
    }

    if (!entry.instance) {
        entry.instance = entry.factory({
            signal,
            effect,
            computed,
            store: key => resolveStore(key),
            inject,
            provide,
            eventBus: storeRegistry['event:bus'],
        });
    }

    return entry.instance;
}

export function resetStore(key) {
    const entry = storeRegistry[key];
    if (!entry) return;
    entry.instance = undefined;
}

export function clearAllStores() {
    Object.keys(storeRegistry).forEach(key => {
        delete storeRegistry[key];
    });
}
