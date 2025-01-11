import { Signal, signal, effect, computed } from './state';

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

function validateHookContext(hookName: string) {
    const context = getCurrentContext();
    if (!context) {
        throw new Error(`${hookName} must be called within setup, connected, or disconnected lifecycle methods`);
    }
    return context;
}

export function useSignal<T>(initialValue: T): Signal<T> {
    validateHookContext('useSignal');
    return signal(initialValue);
}

export function useComputed<T>(callback: ComputedCallback<T>): Signal<T> {
    const context = validateHookContext('useComputed');
    const computedSignal = computed(callback);

    context.cleanups.push(() => {
        // @ts-ignore
        computedSignal.constructor.prototype.dispose?.call(computedSignal);
    });

    return computedSignal;
}

export function useEffect(callback: EffectCallback): void {
    const context = validateHookContext('useEffect');

    const cleanup = effect(() => {
        const result = callback();
        if (typeof result === 'function') {
            context.cleanups.push(result);
        }
    });

    context.cleanups.push(cleanup);
}

export type {
    HooksContext,
    Cleanup,
    EffectCallback,
    ComputedCallback
};