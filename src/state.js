import { signal, effect, computed } from '@preact/signals-core';
import { html } from 'uhtml/reactive';

const registry = new Map();

export function isSignal(obj) {
    return obj && typeof obj === 'object' && typeof obj.peek === 'function' && 'value' in obj;
}

export function defState(key, factory) {
    if (registry.has(key)) throw new Error(`[sig] state "${key}" is already defined`);
    registry.set(key, { factory });
}

export function resolveState(key) {
    const entry = registry.get(key);
    if (!entry) throw new Error(`[sig] state "${key}" is not defined`);
    if (entry.resolving) throw new Error(`[sig] circular dependency: "${key}"`);

    if (!('instance' in entry)) {
        entry.resolving = true;
        try {
            entry.instance = entry.factory({ signal, effect, computed, html, state: resolveState });
        } finally {
            entry.resolving = false;
        }
    }
    return entry.instance;
}