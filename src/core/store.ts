import { effect, ReadonlySignal } from '@preact/signals-core';
import { State, createState, compute } from './state';

type BaseState = Record<string, any>;

type ComputedDef<S extends BaseState> = {
    [key: string]: (state: S) => any;
};

type ActionFunction<S, Args extends any[]> = (...args: Args) => void;

type ActionsDef<S extends BaseState> = {
    [key: string]: ActionFunction<S, any[]>;
};

type StoreModule<S extends BaseState, C extends ComputedDef<S>, A extends ActionsDef<S>> = {
    state: S;
    computed: (context: { state: State<S> }) => C;
    actions: (context: { state: State<S> }) => { [K in keyof A]: A[K] };
};

type ComputedStore<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any
    ? ReadonlySignal<ReturnType<C[K]>>
    : never;
};

export class Store<S extends BaseState, C extends ComputedDef<S>, A extends ActionsDef<S>> {
    private stateSignal: State<S>;
    public computed: ComputedStore<C>;
    public actions: A;

    constructor(module: StoreModule<S, C, A>) {
        this.stateSignal = createState(module.state);

        const computedFns = module.computed({ state: this.stateSignal });
        this.computed = Object.entries(computedFns).reduce((acc, [key, fn]) => ({
            ...acc,
            [key]: compute(this.stateSignal, fn)
        }), {} as ComputedStore<C>);

        this.actions = module.actions({ state: this.stateSignal });
    }

    public getState(): S {
        return this.stateSignal.peek();
    }

    public subscribe(callback: (state: S) => void): () => void {
        return effect(() => {
            callback(this.stateSignal.value);
        });
    }
}

type StoreRecord = {
    [key: string]: Store<any, any, any>;
};

export class StoreManager {
    private stores: StoreRecord = {};

    registerModule<S extends BaseState, C extends ComputedDef<S>, A extends ActionsDef<S>>(
        name: keyof StoreRecord,
        module: StoreModule<S, C, A>
    ): Store<S, C, A> {
        const store = new Store(module);
        this.stores[name] = store;
        return store;
    }

    $<N extends keyof StoreRecord>(name: N): StoreRecord[N] {
        const store = this.stores[name];
        if (!store) {
            throw new Error(`Store module '${String(name)}' not found`);
        }
        return store;
    }

    get list(): StoreRecord {
        return this.stores;
    }
}