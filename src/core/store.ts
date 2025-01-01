type State = Record<string, any>;

type ComputedDef<S extends State> = {
    [key: string]: (state: S) => any;
};

type ActionsDef<S extends State> = {
    [key: string]: (state: S, ...args: any[]) => void;
};

type StoreModule<
    S extends State,
    C extends ComputedDef<S>,
    A extends ActionsDef<S>
> = {
    state: S;
    computed: (context: { state: { value: S } }) => C;
    actions: (context: { state: { value: S } }) => A;
};

type StoreDefinition<
    S extends State,
    C extends ComputedDef<S>,
    A extends ActionsDef<S>
> = {
    state: S;
    computed: C;
    actions: A;
    subscribe: (callback: (state: S) => void) => () => void;
};

// store.ts
export class Store<S extends State, C extends ComputedDef<S>, A extends ActionsDef<S>> {
    private state: { value: S };
    private subscribers: Set<(state: S) => void>;
    public computed: C;
    public actions: A;

    constructor(module: StoreModule<S, C, A>) {
        this.state = { value: { ...module.state } };
        this.subscribers = new Set();
        this.computed = module.computed({ state: this.state });
        this.actions = module.actions({ state: this.state });

        // Создаем Proxy для отслеживания изменений
        this.state = new Proxy({ value: { ...module.state } }, {
            set: (target, prop, value) => {
                target[prop as keyof typeof target] = value;
                this.notifySubscribers();
                return true;
            }
        });
    }

    private notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.state.value));
    }

    public subscribe(callback: (state: S) => void): () => void {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    public getState(): S {
        return this.state.value;
    }
}

// store-manager.ts
export class StoreManager {
    private stores: Map<string, Store<any, any, any>> = new Map();

    registerModule<
        S extends State,
        C extends ComputedDef<S>,
        A extends ActionsDef<S>
    >(
        name: string,
        module: StoreModule<S, C, A>
    ): Store<S, C, A> {
        const store = new Store(module);
        this.stores.set(name, store);
        return store;
    }

    $<T extends Store<any, any, any>>(name: string): T {
        const store = this.stores.get(name);
        if (!store) {
            throw new Error(`Store module '${name}' not found`);
        }
        return store as T;
    }
}

