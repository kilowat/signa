import { effect as rawEffect } from '@preact/signals-core';

let currentScope = null;

export function createScope() {
    return {
        cleanups: new Set(),
        disposed: false,
    };
}

export function withScope(scope, fn) {
    const previousScope = currentScope;

    currentScope = scope;

    try {
        return fn();
    } finally {
        currentScope = previousScope;
    }
}

export function effectInScope(fn) {
    const scope = currentScope;

    if (!scope || scope.disposed) {
        throw new Error(
            '[$$] effect() must be called inside a state or component setup'
        );
    }

    const stop = rawEffect(fn);

    scope.cleanups.add(stop);

    return stop;
}

export function addCleanup(cleanup) {
    const scope = currentScope;

    if (!scope || scope.disposed) {
        throw new Error(
            '[$$] cleanup must be registered inside a state or component setup'
        );
    }

    scope.cleanups.add(cleanup);

    return cleanup;
}

export function disposeScope(scope) {
    if (!scope || scope.disposed) {
        return;
    }

    scope.disposed = true;

    const cleanups = [...scope.cleanups].reverse();

    scope.cleanups.clear();

    for (const cleanup of cleanups) {
        try {
            cleanup();
        } catch (e) {
            console.error('[$$] cleanup error:', e);
        }
    }
}