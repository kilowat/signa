type Cleanup = () => void;
type EffectCallback = () => (void | Cleanup);
type ComputedCallback<T> = () => T;

interface HooksContext {
    cleanups: Cleanup[];
    currentPhase: 'setup' | 'connected' | 'disconnected' | null;
}

const contextStack: HooksContext[] = [];

export function createHooksContext(): HooksContext {
    return {
        cleanups: [],
        currentPhase: null
    };
}

export function pushContext(context: HooksContext, phase: 'setup' | 'connected' | 'disconnected') {
    context.currentPhase = phase;
    contextStack.push(context);
}

export function popContext() {
    if (contextStack.length === 0) {
        console.warn('Attempting to pop empty context stack');
        return;
    }
    const context = contextStack.pop();
    if (context) {
        context.currentPhase = null;
    }
}

export function getCurrentContext(): HooksContext | undefined {
    return contextStack[contextStack.length - 1];
}

export type {
    HooksContext,
    Cleanup,
    EffectCallback,
    ComputedCallback
};