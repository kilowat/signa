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
export interface StoreOptions<S = any, G extends GettersFn<S> = any, C extends ComputedFn<S> = any, A extends ActionsFn<S, ReturnType<C>> = any> {
    state: S;
    getters?: G;
    computed?: C;
    actions?: A;
}
export interface StoreContext<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    state: State<S>;
    getters: GettersProperties<ReturnType<G>>;
    computed: ComputedProperties<ReturnType<C>>;
    actions: ReturnType<A>;
}
export interface GlobalStore extends Record<string, StoreContext<any, any, any, any>> {
}
export interface StoreRegistry {
    list: Partial<GlobalStore>;
    $: <K extends keyof GlobalStore>(key: K) => GlobalStore[K];
    register: <K extends keyof GlobalStore>(key: K, store: GlobalStore[K]) => void;
}
export declare function createStore<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>(options: StoreOptions<S, G, C, A>): StoreContext<S, G, C, A>;
export declare function defineStore<S extends object, G extends GettersFn<S>, C extends Record<string, (...args: any[]) => any>, A extends ActionsFn<S, C>>(options: {
    key: keyof GlobalStore;
    state: S;
    getters?: G;
    computed?: (context: {
        state: State<S>;
    }) => C;
    actions?: A;
}): StoreContext<S, G, (context: {
    state: State<S>;
}) => C, A>;
export declare const storeRegistry: StoreRegistry;
export {};
