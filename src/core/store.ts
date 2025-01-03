import { State, createState, compute } from './state';
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

export interface GlobalStore extends Record<string, StoreContext<any, any, any, any>> { }

export interface StoreRegistry {
    list: Partial<GlobalStore>;
    $: <K extends keyof GlobalStore, >(key: K) => GlobalStore[K];
    register: <K extends keyof GlobalStore>(
        key: K,
        store: GlobalStore[K]
    ) => void;
}

const globalStore: Partial<GlobalStore> = {};

export function createStore<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>(
    options: StoreOptions<S, G, C, A>
): StoreContext<S, G, C, A> {
    const { state: initialState, getters: gettersFn, computed: computedFn, actions: actionsFn } = options;

    const state = createState(initialState);

    const getters = gettersFn
        ? Object.entries(gettersFn({ state })).reduce((acc, [key, fn]) => ({
            ...acc,
            [key]: fn()
        }), {}) as GettersProperties<ReturnType<G>>
        : ({} as GettersProperties<ReturnType<G>>);

    const computed = computedFn
        ? Object.entries(computedFn({ state })).reduce((acc, [key, fn]) => ({
            ...acc,
            [key]: compute(state, () => fn())
        }), {}) as ComputedProperties<ReturnType<C>>
        : ({} as ComputedProperties<ReturnType<C>>);

    const actions = actionsFn
        ? (actionsFn({
            state,
            computed
        }) as ReturnType<A>)
        : ({} as ReturnType<A>);

    return { state, getters, computed, actions };
}

function registerStore<K extends keyof GlobalStore>(
    key: K,
    store: GlobalStore[K]
): void {
    if (globalStore[key]) {
        throw new Error(`Store "${key}" already exists`);
    }
    globalStore[key] = store;

}

function getStore<K extends keyof GlobalStore>(key: K): GlobalStore[K] {
    const store = globalStore[key];
    if (!store) {
        throw new Error(`Store "${key}" not found`);
    }
    return store;
}

export function defineStore<T extends object>({ state, key }: StoreConfig<T>) {
    const store = createStore({ state });
    storeRegistry.register(key, store);
    return store;
}

export const storeRegistry: StoreRegistry = {
    list: globalStore,
    $: getStore,
    register: registerStore,
};