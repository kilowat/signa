import { reactive } from 'uhtml/reactive';
import { effect, ReadonlySignal } from '@preact/signals-core';
import { State, createState, compute } from './state';
import { GlobalStore, globalStore } from './store';

// Component types
type ComputedFn<S> = (context: {
    state: State<S>;
    store: GlobalStore;
}) => Record<string, (...args: any[]) => any>;

type ActionsFn<S, C> = (context: {
    state: State<S>;
    computed: ComputedProperties<C>;
    store: GlobalStore;
}) => Record<string, (...args: any[]) => any>;


type GettersFn<S> = ComputedFn<S>

export type ComputedProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any
    ? ReadonlySignal<ReturnType<C[K]>>
    : never;
};

export type GettersProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any
    ? ReturnType<C[K]>
    : never;
};

interface BaseContext<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    state: State<S>;
    getters: GettersProperties<ReturnType<G>>;
    computed: ComputedProperties<ReturnType<C>>;
    actions: ReturnType<A>;
    store: typeof globalStore; // Глобальный store
}

interface ComponentContext<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>
    extends BaseContext<S, G, C, A> {
    element: HTMLElement;
    slots: Record<string, Node[]>;
}

interface ListenerParams<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>
    extends ComponentContext<S, G, C, A> {
    newValue: S;
    oldValue: S;
}

interface ComponentOptions<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    tagName: string;
    state?: S;
    getters?: G;
    computed?: C;
    actions?: A;
    connected?: (context: ComponentContext<S, G, C, A>) => void;
    render?: (context: ComponentContext<S, G, C, A>) => unknown;
    listen?: (params: ListenerParams<S, G, C, A>) => void;
    disconnected?: (context: ComponentContext<S, G, C, A>) => void;
}
export interface StateSubscriptionCallback<S> {
    newValue: S;
    oldValue: S;
}

export interface CustomHtmlElement<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> extends HTMLElement {
    readonly context: ComponentContext<S, G, C, A>;
    readonly state: State<S>;
    readonly getters: G;
    readonly computed: C;
    readonly actions: A;
    subscribeToState(callback: (params: StateSubscriptionCallback<S>) => void): () => void;
}

export function defineComponent<
    S,
    G extends GettersFn<S>,
    C extends ComputedFn<S>,
    A extends ActionsFn<S, ReturnType<C>>
>(options: ComponentOptions<S, G, C, A>) {
    const {
        tagName,
        state: initialState,
        getters: gettersFn,
        computed: computedFn,
        actions: actionsFn,
        connected,
        disconnected,
        render,
        listen
    } = options;

    const uRender = reactive(effect);

    class CustomElement extends HTMLElement {
        state: State<S>;
        getters: GettersProperties<ReturnType<G>>;
        computed: ComputedProperties<ReturnType<C>>;
        actions: ReturnType<A>;
        slots: Record<string, Node[]> = {};
        cleanup: (() => void)[] = [];

        constructor() {
            super();
            this.state = createState(initialState as S);
            this.getters = this.setupGetters();
            this.computed = this.setupComputed();
            this.actions = this.setupActions();
        }

        get context(): ComponentContext<S, G, C, A> {
            return {
                state: this.state,
                getters: this.getters,
                computed: this.computed,
                actions: this.actions,
                element: this,
                slots: this.slots,
                store: globalStore
            };
        }

        public subscribeToState(callback: (params: StateSubscriptionCallback<S>) => void): () => void {
            let previousValue = this.state.peek();

            const disposer = effect(() => {
                const currentValue = this.state.value;
                callback({
                    newValue: currentValue,
                    oldValue: previousValue
                });
                previousValue = currentValue;
            });

            this.cleanup.push(disposer);
            return () => {
                const index = this.cleanup.indexOf(disposer);
                if (index > -1) {
                    this.cleanup.splice(index, 1);
                }
                disposer();
            };
        }
        setupGetters(): GettersProperties<ReturnType<G>> {
            if (!gettersFn) return {} as GettersProperties<ReturnType<G>>;

            const getterObj = gettersFn({
                state: this.state,
                store: globalStore
            });

            return Object.entries(getterObj).reduce((acc, [key, fn]) => ({
                ...acc,
                [key]: fn()
            }), {}) as GettersProperties<ReturnType<G>>;
        }


        setupComputed(): ComputedProperties<ReturnType<C>> {
            if (!computedFn) return {} as ComputedProperties<ReturnType<C>>;

            const computedObj = computedFn({
                state: this.state,
                store: globalStore
            });

            return Object.entries(computedObj).reduce((acc, [key, fn]) => ({
                ...acc,
                [key]: compute(this.state, () => fn())
            }), {}) as ComputedProperties<ReturnType<C>>;
        }

        setupActions(): ReturnType<A> {
            if (!actionsFn) return {} as ReturnType<A>;

            const context = {
                state: this.state,
                getters: this.getters,
                computed: this.computed,
                store: globalStore,
            };

            return actionsFn(context) as ReturnType<A>;
        }

        setupListener() {
            if (!listen) return;

            let previousValue = this.state.peek();
            const cleanup = effect(() => {
                const currentValue = this.state.value;
                listen({
                    ...this.context,
                    newValue: currentValue,
                    oldValue: previousValue
                });
                previousValue = currentValue;
            });

            this.cleanup.push(cleanup);
        }

        setupRender() {
            if (!render) return;

            const cleanup = uRender(this, () => render(this.context));
            this.cleanup.push(cleanup);
        }

        collectSlots() {
            const slots: Record<string, Node[]> = { default: [] };

            Array.from(this.childNodes).forEach(node => {
                if (node instanceof Element) {
                    const slotName = node.getAttribute('data-slot') || 'default';
                    slots[slotName] = slots[slotName] || [];
                    slots[slotName].push(node);
                } else if (node.textContent?.trim()) {
                    slots.default.push(node);
                }
            });

            this.slots = slots;
        }

        connectedCallback() {
            this.collectSlots();
            this.setupListener();
            this.setupRender();
            connected?.(this.context);
        }

        disconnectedCallback() {
            this.cleanup.forEach(cleanup => cleanup());
            this.cleanup = [];
            disconnected?.(this.context);
        }
    }

    if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElement);
    }
}