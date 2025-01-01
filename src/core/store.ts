import { ReadonlySignal } from '@preact/signals-core';
import { State, createState, compute } from './state';

type ComputedFn<S> = (context: {
    state: State<S>;
}) => Record<string, (...args: any[]) => any>;

type ActionsFn<S, C> = (context: {
    state: State<S>;
    computed: ComputedProperties<C>;
}) => Record<string, (...args: any[]) => any>;

type ComputedProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any
    ? ReadonlySignal<ReturnType<C[K]>>
    : never;
};

interface StoreOptions<S, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    state: S;
    computed?: C;
    actions?: A;
}

interface StoreContext<S, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    state: State<S>;
    computed: ComputedProperties<ReturnType<C>>;
    actions: ReturnType<A>;
}

export function createStore<S, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>(
    options: StoreOptions<S, C, A>
): StoreContext<S, C, A> {
    const { state: initialState, computed: computedFn, actions: actionsFn } = options;

    const state = createState(initialState);

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

    return { state, computed, actions };
}

export type GlobalStore = Record<string, StoreContext<any, any, any>>;

export const globalStore: GlobalStore = {};

export function registerStore<K extends string, S, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>(
    key: K,
    store: StoreContext<S, C, A>
): void {
    if (globalStore[key]) {
        throw new Error(`Store с ключом "${key}" уже существует.`);
    }
    globalStore[key] = store;
}

export function getStore<K extends keyof typeof globalStore>(key: K): typeof globalStore[K] {
    const store = globalStore[key];
    if (!store) {
        throw new Error(`Store с ключом "${key}" не найден.`);
    }
    return store;
}

