import { State } from './state';
import { ComputedProperties, GettersProperties } from './component';
type ComputedFn<S> = (context: {
    state: State<S>;
}) => Record<string, (...args: any[]) => any>;
type ActionsFn<S, C> = (context: {
    state: State<S>;
    computed: ComputedProperties<C>;
}) => Record<string, (...args: any[]) => any>;
type GettersFn<S> = ComputedFn<S>;
interface StoreOptions<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    state: S;
    getters?: G;
    computed?: C;
    actions?: A;
}
interface StoreContext<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    state: State<S>;
    getters: GettersProperties<ReturnType<G>>;
    computed: ComputedProperties<ReturnType<C>>;
    actions: ReturnType<A>;
}
export declare function createStore<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>(options: StoreOptions<S, G, C, A>): StoreContext<S, G, C, A>;
export type GlobalStore = Record<string, StoreContext<any, any, any, any>>;
export declare const globalStore: GlobalStore;
export declare function registerStore<K extends string, S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>(key: K, store: StoreContext<S, G, C, A>): void;
export declare function getStore<K extends keyof typeof globalStore>(key: K): typeof globalStore[K];
export {};
