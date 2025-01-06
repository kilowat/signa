import { State, createState } from './state';
import { ComputedProperties, GettersProperties } from './component';
import { ComputedManager } from './untils';
import { app, App } from './app';

type ComputedFn<S> = (context: {
    state: State<S>;
    app: App;
}) => Record<string, (...args: any[]) => any>;

type ActionsFn<S, C> = (context: {
    state: State<S>;
    computed: ComputedProperties<C>;
    app: App;
}) => Record<string, (...args: any[]) => any>;

type GettersFn<S> = (context: {
    state: State<S>;
    app: App;
}) => Record<string, (...args: any[]) => any>;


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
    app: App;
}

export interface GlobalStore extends Record<string, StoreContext<any, any, any, any>> { }

export interface StoreRegistry {
    list: Partial<GlobalStore>;
    $: <K extends keyof GlobalStore, >(key: K) => GlobalStore[K];
    register: <K extends keyof GlobalStore>(
        key: K,
        store: GlobalStore[K]
    ) => void;
}

const maxAge = 15 * 60 * 1000; // 15 min store computed
const cacheSize = 500; // cache store size computed

const globalStore: Partial<GlobalStore> = {};

export function createStore<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>(
    options: StoreOptions<S, G, C, A>
): StoreContext<S, G, C, A> {
    const { state: initialState, getters: gettersFn, computed: computedFn, actions: actionsFn } = options;

    const state = createState(initialState);

    const getters = gettersFn
        ? Object.entries(gettersFn({ state, app })).reduce((acc, [key, fn]) => ({
            ...acc,
            [key]: fn()
        }), {}) as GettersProperties<ReturnType<G>>
        : ({} as GettersProperties<ReturnType<G>>);

    const computed = computedFn
        ? Object.entries(computedFn({ state, app })).reduce((acc, [key, fn]) => {
            const computedProperty = ComputedManager.createComputed(
                () => fn(),
                {
                    maxAge,
                    cacheSize,
                }
            );

            return {
                ...acc,
                [key]: computedProperty
            };
        }, {}) as ComputedProperties<ReturnType<C>>
        : ({} as ComputedProperties<ReturnType<C>>);

    const actions = actionsFn
        ? (actionsFn({
            state,
            computed,
            app
        }) as ReturnType<A>)
        : ({} as ReturnType<A>);

    return { state, getters, computed, actions, app };
}

function registerStore<K extends keyof GlobalStore>(
    key: K,
    store: GlobalStore[K]
): void {
    globalStore[key] = store;

}

function getStore<K extends keyof GlobalStore>(key: K): GlobalStore[K] {
    const store = globalStore[key];
    if (!store) {
        throw new Error(`Store "${key}" not found`);
    }
    return store;
}

export function defineStore<
    S extends object,
    G extends GettersFn<S>,
    C extends Record<string, (...args: any[]) => any>,
    A extends ActionsFn<S, C>
>(options: {
    key: keyof GlobalStore;
    state: S;
    getters?: G;
    computed?: (context: { state: State<S> }) => C;
    actions?: A;
}) {
    const { key, state, ...rest } = options;
    const store = createStore({ state: state, ...rest });
    storeRegistry.register(key, store);
    return store;
}

export const storeRegistry: StoreRegistry = {
    list: globalStore,
    $: getStore,
    register: registerStore,
};