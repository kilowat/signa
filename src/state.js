
import {
    signal,
    computed,
} from '@preact/signals-core';

import { html } from 'uhtml/reactive';

import {
    createScope,
    withScope,
    effectInScope,
    disposeScope,
} from './scope.js';

const registry = new Map();

export function isSignal(obj) {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.peek === 'function' &&
        'value' in obj
    );
}

export function defState(key, factory) {
    if (registry.has(key)) {
        throw new Error(
            `[$$] "${key}" is already registered`
        );
    }

    registry.set(key, {
        type: 'state',
        factory,
    });
}

export function resolveState(key) {
    const entry = registry.get(key);

    if (!entry) {
        throw new Error(
            `[$$] state "${key}" is not defined`
        );
    }

    if (entry.type !== 'state') {
        throw new Error(
            `[$$] "${key}" is not a state`
        );
    }

    if (entry.resolving) {
        throw new Error(
            `[$$] circular dependency: "${key}"`
        );
    }

    if (!('instance' in entry)) {
        entry.resolving = true;
        entry.scope = createScope();

        try {
            entry.instance = withScope(
                entry.scope,
                () =>
                    entry.factory(
                        {
                            signal,
                            computed,
                            effect: effectInScope,
                            html,
                            state: resolveState,
                        },
                        createStateAccess()
                    )
            );
        } catch (e) {
            disposeScope(entry.scope);

            delete entry.scope;
            delete entry.instance;

            throw e;
        } finally {
            entry.resolving = false;
        }
    }

    return entry.instance;
}

export function createStateAccess() {
    return new Proxy(
        {},
        {
            get(_, key) {
                if (typeof key !== 'string') {
                    return undefined;
                }

                return resolveState(key);
            },

            has(_, key) {
                return (
                    typeof key === 'string' &&
                    registry.has(key)
                );
            },
        }
    );
}

export function hasState(key) {
    return registry.get(key)?.type === 'state';
}

export function getRegisteredKeys() {
    return [...registry.keys()];
}
