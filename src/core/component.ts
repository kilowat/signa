import { reactive } from 'uhtml/reactive';
import { effect, ReadonlySignal, Signal, signal } from '@preact/signals-core';
import { State, createState, compute } from './state';
import { StoreRegistry, storeRegistry } from './store';

type ConstructorToType<T> =
    T extends StringConstructor ? string :
    T extends NumberConstructor ? number :
    T extends BooleanConstructor ? boolean :
    T extends ArrayConstructor ? T[] :
    T extends ObjectConstructor ? Record<string, unknown> :
    T;

type ModelPropDefinition<T> = {
    type: TypeConstructor;
    default?: T;
    model?: { __type: T };
};

type SimplePropDefinition<T extends TypeConstructor> = {
    type: T;
    default?: ConstructorToType<T>;
};

type PropDefinition<T = unknown> =
    T extends TypeConstructor
    ? SimplePropDefinition<T>
    : ModelPropDefinition<T>;

type InferPropType<T> =
    T extends SimplePropDefinition<infer U>
    ? ConstructorToType<U>
    : T extends ModelPropDefinition<infer M>
    ? M
    : never;

type InferProps<T extends Record<string, PropDefinition>> = {
    [K in keyof T]: InferPropType<T[K]>;
};

export function prop<T>(config: Omit<ModelPropDefinition<T>, 'model'>): ModelPropDefinition<T> {
    return {
        ...config,
        model: { __type: {} as T },
    };
}

type TypeConstructor =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ObjectConstructor
    | ArrayConstructor;

type PropType = string | number | boolean | object | null | any[];

type PropsDefinition = Record<string, SimplePropDefinition<TypeConstructor> | ModelPropDefinition<any>>;

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

type BaseComputedContext<P, S> = {
    props: Signal<P>;
    state: State<S>;
    store: StoreRegistry;
};

type ActionContext<P, S, C> = BaseComputedContext<P, S> & {
    computed: ComputedProperties<C>;
};

type DefaultRecord = Record<string, (...args: any[]) => any>;
type ComputedFn<P, S> = (context: BaseComputedContext<P, S>) => DefaultRecord;
type GettersFn<P, S> = ComputedFn<P, S>;
type ActionsFn<P, S, C> = (context: ActionContext<P, S, C>) => DefaultRecord;

export interface ComponentContext<P, S, G extends GettersFn<P, S>, C extends ComputedFn<P, S>, A extends ActionsFn<P, S, ReturnType<C>>> {
    props: P;
    state: State<S>;
    getters: GettersProperties<ReturnType<G>>;
    computed: ComputedProperties<ReturnType<C>>;
    actions: ReturnType<A>;
    element: CustomHtmlElement;
    slots: Record<string, Node[]>;
    store: StoreRegistry;
}

interface ListenerParams<P, S, G extends GettersFn<P, S>, C extends ComputedFn<P, S>, A extends ActionsFn<P, S, ReturnType<C>>> extends ComponentContext<P, S, G, C, A> {
    newValue: S;
    oldValue: S;
}

export interface CustomHtmlElement extends HTMLElement {
    $<T = any>(key: string): T | undefined;
}

interface ComponentOptions<P extends PropsDefinition, S> {
    tagName: string;
    props?: P;
    state?: S;
    getters?: GettersFn<InferProps<P>, S>;
    computed?: ComputedFn<InferProps<P>, S>;
    actions?: ActionsFn<InferProps<P>, S, ReturnType<ComputedFn<InferProps<P>, S>>>;
    connected?: (context: ComponentContext<
        InferProps<P>,
        S,
        GettersFn<InferProps<P>, S>,
        ComputedFn<InferProps<P>, S>,
        ActionsFn<InferProps<P>, S, ReturnType<ComputedFn<InferProps<P>, S>>>
    >) => void;
    render?: (context: ComponentContext<
        InferProps<P>,
        S,
        GettersFn<InferProps<P>, S>,
        ComputedFn<InferProps<P>, S>,
        ActionsFn<InferProps<P>, S, ReturnType<ComputedFn<InferProps<P>, S>>>
    >) => unknown;
    listen?: (params: ListenerParams<
        InferProps<P>,
        S,
        GettersFn<InferProps<P>, S>,
        ComputedFn<InferProps<P>, S>,
        ActionsFn<InferProps<P>, S, ReturnType<ComputedFn<InferProps<P>, S>>>
    >) => void;
    disconnected?: (context: ComponentContext<
        InferProps<P>,
        S,
        GettersFn<InferProps<P>, S>,
        ComputedFn<InferProps<P>, S>,
        ActionsFn<InferProps<P>, S, ReturnType<ComputedFn<InferProps<P>, S>>>
    >) => void;
}

export interface StateSubscriptionCallback<S> {
    newValue: S;
    oldValue: S;
}

export function defineComponent<P extends PropsDefinition, S>(
    options: ComponentOptions<P, S>
) {
    const {
        tagName,
        props: propsDefinition = {} as P,
        state: initialState,
        getters: gettersFn = (() => ({})) as GettersFn<InferProps<P>, S>,
        computed: computedFn = (() => ({})) as ComputedFn<InferProps<P>, S>,
        actions: actionsFn = (() => ({})) as ActionsFn<InferProps<P>, S, ReturnType<ComputedFn<InferProps<P>, S>>>,
        connected,
        disconnected,
        render,
        listen
    } = options;

    const uRender = reactive(effect);

    class CustomElement extends HTMLElement implements CustomHtmlElement {
        props: Signal<InferProps<P>>;
        state: State<S>;
        getters: GettersProperties<ReturnType<typeof gettersFn>>;
        computed: ComputedProperties<ReturnType<typeof computedFn>>;
        actions: ReturnType<typeof actionsFn>;
        slots: Record<string, Node[]> = {};
        cleanup: (() => void)[] = [];

        static get observedAttributes() {
            return Object.keys(propsDefinition).map((name) => `data-${name}`);
        }

        constructor() {
            super();

            this.props = signal({} as InferProps<P>);
            this.state = createState(initialState as S);
            this.getters = this.setupGetters();
            this.computed = this.setupComputed();
            this.actions = this.setupActions();
            requestAnimationFrame(() => {
                this.props.value = this.initializeProps();
            });
        }

        public $<T = any>(key: string) {
            return (this as any)[key] as T | undefined;
        }

        initializeProps(): InferProps<P> {
            const props = {} as InferProps<P>;

            for (const [key, definition] of Object.entries(propsDefinition)) {
                const attrName = `data-${key}`;
                const attrValue = this.getAttribute(attrName);

                const defaultValue = definition.default ?? this.getDefaultForType(definition.type);
                props[key as keyof P] = attrValue !== null
                    ? this.parseAttributeValue(attrValue, definition.type)
                    : defaultValue;
            }
            return props;
        }

        getDefaultForType(type: PropDefinition['type']): PropType {
            switch (type) {
                case String:
                    return '';
                case Number:
                    return 0;
                case Boolean:
                    return false;
                case Object:
                    return {};
                case Array:
                    return [];
                default:
                    return null;
            }
        }

        parseAttributeValue(value: string, type: PropDefinition['type']): PropType {
            switch (type) {
                case Number:
                    return Number(value);
                case Boolean:
                    return value !== null && value !== 'false';
                case Object:
                case Array:
                    try {
                        return JSON.parse(value);
                    } catch {
                        return type === Object ? {} : [];
                    }
                default:
                    return value;
            }
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            const propName = name.replace(/^data-/, '');
            const propDef = (propsDefinition as any)[propName];
            if (!propDef) return;

            const value = this.parseAttributeValue(newValue, propDef.type);

            this.updateProp(propName as keyof P, value);

        }

        updateProp(name: keyof P, value: PropType) {
            this.props.value = {
                ...this.props.value,
                [name]: value,
            };
        }

        get context(): ComponentContext<
            InferProps<P>,
            S,
            typeof gettersFn,
            typeof computedFn,
            typeof actionsFn
        > {
            return {
                props: this.getPropValue(),
                state: this.state,
                getters: this.getters,
                computed: this.computed,
                actions: this.actions,
                element: this,
                slots: this.slots,
                store: storeRegistry,
            };
        }

        getPropValue() {
            return this.props.value;
        }

        setupGetters(): GettersProperties<ReturnType<typeof gettersFn>> {
            const getterObj = gettersFn({
                props: this.props,
                state: this.state,
                store: storeRegistry,
            });

            return Object.entries(getterObj).reduce((acc, [key, fn]) => ({
                ...acc,
                [key]: fn()
            }), {}) as GettersProperties<ReturnType<typeof gettersFn>>;
        }

        setupComputed(): ComputedProperties<ReturnType<typeof computedFn>> {
            const computedObj = computedFn({
                props: this.props,
                state: this.state,
                store: storeRegistry,
            });

            return Object.entries(computedObj).reduce((acc, [key, fn]) => ({
                ...acc,
                [key]: compute(this.state, () => fn())
            }), {}) as ComputedProperties<ReturnType<typeof computedFn>>;
        }

        setupActions(): ReturnType<typeof actionsFn> {
            return actionsFn({
                props: this.props,
                state: this.state,
                computed: this.computed,
                store: storeRegistry,
            });
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

    customElements.define(tagName, CustomElement);
    return CustomElement;
}