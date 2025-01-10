import { Signal } from './state';
type Cleanup = () => void;
type EffectCallback = () => (void | Cleanup);
type ComputedCallback<T> = () => T;
interface HooksContext {
    cleanups: Cleanup[];
    currentPhase: 'setup' | 'connected' | 'disconnected' | null;
}
export declare function createHooksContext(): HooksContext;
export declare function pushContext(context: HooksContext, phase: 'setup' | 'connected' | 'disconnected'): void;
export declare function popContext(): void;
export declare function getCurrentContext(): HooksContext | undefined;
export declare function useSignal<T>(initialValue: T): Signal<T>;
export declare function useComputed<T>(callback: ComputedCallback<T>): Signal<T>;
export declare function useEffect(callback: EffectCallback): void;
export type { HooksContext, Cleanup, EffectCallback, ComputedCallback };
