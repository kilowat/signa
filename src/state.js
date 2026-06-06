import { signal, effect, computed } from '@preact/signals-core';
import { html } from 'uhtml/reactive'; // добавить

const registry = {};

export function isSignal(obj) {
    return obj && typeof obj === 'object' && typeof obj.peek === 'function' && 'value' in obj;
}

export function defState(key, factory) {
    if (registry[key]) throw new Error(`State "${key}" is already defined`);
    registry[key] = { factory, instance: undefined };
}

export function resolveState(key) {
    const entry = registry[key];
    if (!entry) {
        console.warn(`[sig] "${key}" is not defined yet`);
        return undefined;
    }
    if (!entry.instance) {
        entry.instance = entry.factory({ signal, effect, computed, html, state: resolveState });
    }
    return entry.instance;
}