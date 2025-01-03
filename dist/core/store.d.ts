import { State } from './state';
import { ComputedProperties, GettersProperties } from './component';
type StoreConfig<T> = {
    state: T;
    key: keyof GlobalStore;
};
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
export declare function defineStore<T extends object>({ state, key }: StoreConfig<T>): StoreContext<T, GettersFn<T>, ComputedFn<T>, ActionsFn<T, Record<string, (...args: any[]) => any>>>;
export declare const storeRegistry: StoreRegistry;
export {};
