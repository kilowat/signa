import { State, createState } from './state';
import { ComputedProperties, GettersProperties } from './component';
import { computed as preactComputed } from '@preact/signals-core';

type GettersFn<S> = (context: {
    state: State<S>;
}) => Record<string, (...args: any[]) => any>;

type ActionsFn<S, C> = (context: {
    state: State<S>;
    computed: ComputedProperties<C>;
}) => Record<string, (...args: any[]) => any>;

export interface StoreContext<S, G extends GettersFn<S>, C, A extends ActionsFn<S, C>> {
    state: State<S>;
    getters: GettersProperties<ReturnType<G>>;
    computed: ComputedProperties<C>;
    actions: ReturnType<A>;
}

export interface GlobalStore extends Record<string, StoreContext<any, any, any, any>> { }

export interface StoreRegistry {
    list: Partial<GlobalStore>;
    $: <K extends keyof GlobalStore>(key: K) => GlobalStore[K];
    register: <K extends keyof GlobalStore>(
        key: K,
        store: GlobalStore[K]
    ) => void;
}

const globalStore: Partial<GlobalStore> = {};

export function createStore<
    S,
    G extends GettersFn<S>,
    C extends Record<string, (...args: any[]) => any>,
    A extends ActionsFn<S, C>
>(options: {
    stateValue: S;
    getters?: G;
    computed?: (context: { state: State<S> }) => C;
    actions?: A;
}): StoreContext<S, G, C, A> {
    const { stateValue: initialState, getters: gettersFn, computed: computedFn, actions: actionsFn } = options;

    const state = createState(initialState);

    const getters = gettersFn
        ? Object.entries(gettersFn({ state })).reduce((acc, [key, fn]) => ({
            ...acc,
            [key]: fn()
        }), {}) as GettersProperties<ReturnType<G>>
        : ({} as GettersProperties<ReturnType<G>>);

    const computedSignals = new Map<string, any>();

    const computed = computedFn
        ? Object.entries(computedFn({ state })).reduce((acc, [key, fn]) => {
            if (fn.length === 0) {
                if (!computedSignals.has(key)) {
                    computedSignals.set(key, preactComputed(() => fn()));
                }
                return {
                    ...acc,
                    [key]: () => computedSignals.get(key).value
                };
            }
            return {
                ...acc,
                [key]: (...args: any[]) => fn(...args)
            };
        }, {}) as ComputedProperties<C>
        : ({} as ComputedProperties<C>);

    const actions = actionsFn
        ? (actionsFn({
            state,
            computed
        }) as ReturnType<A>)
        : ({} as ReturnType<A>);

    return { state, getters, computed, actions };
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
    const store = createStore({ stateValue: state, ...rest });
    storeRegistry.register(key, store);
    return store;
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

export const storeRegistry: StoreRegistry = {
    list: globalStore,
    $: getStore,
    register: registerStore,
};