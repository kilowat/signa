import { reactive } from 'uhtml/reactive';
import { effect, ReadonlySignal, Signal, signal } from '@preact/signals-core';
import { State, createState, compute } from './state';
import { StoreRegistry, storeRegistry, GlobalStore } from './store';

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

type TypeConstructor =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ObjectConstructor
    | ArrayConstructor;

type BaseContext<P, S> = {
    props: P;
    el: CustomHtmlElement;
    slots: Record<string, Node[]>,
    state: State<S>;
    store: StoreRegistry;
};

type GettersFn<P, S> = (context: BaseContext<P, S>) => Record<string, () => any>;
type ComputedFn<P, S> = (context: BaseContext<P, S>) => Record<string, () => any>;
type ActionsFn<P, S, C> = (context: BaseContext<P, S> & {
    computed: ComputedProperties<C>;
}) => Record<string, (...args: any[]) => any>;

export interface ComponentContext<
    P,
    S,
    G extends GettersFn<P, S>,
    C extends ComputedFn<P, S>,
    A extends ActionsFn<P, S, ReturnType<C>>
> {
    props: P;
    state: State<S>;
    getters: GettersProperties<ReturnType<G>>;
    computed: ComputedProperties<ReturnType<C>>;
    actions: ReturnType<A>;
    el: CustomHtmlElement;
    slots: Record<string, Node[]>;
    store: StoreRegistry;
}

export interface CustomHtmlElement extends HTMLElement {
    $<T = any>(key: string): T | undefined;
    emitEvent<T = any>(name: string, detail?: T): void;
}

export interface ComponentOptions<
    P extends Record<string, PropDefinition> = any,
    S = any,
    G extends GettersFn<InferProps<P>, S> = any,
    C extends ComputedFn<InferProps<P>, S> = any,
    A extends ActionsFn<InferProps<P>, S, ReturnType<C>> = any
> {
    tagName: string;
    props?: P;
    state?: S;
    getters?: G;
    computed?: C;
    actions?: A;
    connected?: (context: ComponentContext<InferProps<P>, S, G, C, A>) => void;
    render?: (context: ComponentContext<InferProps<P>, S, G, C, A>) => unknown;
    listen?: (params: ComponentContext<InferProps<P>, S, G, C, A> & {
        newValue: S;
        oldValue: S;
    }) => void;
    disconnected?: (context: ComponentContext<InferProps<P>, S, G, C, A>) => void;
}



export function defineComponent<
    P extends Record<string, PropDefinition>,
    S,
    G extends GettersFn<InferProps<P>, S>,
    C extends ComputedFn<InferProps<P>, S>,
    A extends ActionsFn<InferProps<P>, S, ReturnType<C>>
>(options: ComponentOptions<P, S, G, C, A>) {
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
        getters: GettersProperties<ReturnType<G>>;
        computed: ComputedProperties<ReturnType<C>>;
        actions: ReturnType<A>;
        slots: Record<string, Node[]> = {};
        cleanup: (() => void)[] = [];

        static get observedAttributes() {
            return Object.keys(propsDefinition).map((name) => `data-${name}`);
        }

        constructor() {
            super();
            this.props = signal({} as InferProps<P>);
            this.props.value = this.initializeProps();
            this.state = createState(initialState as S);
            this.getters = this.setupGetters();
            this.computed = this.setupComputed();
            this.actions = this.setupActions();
        }

        public $<T = any>(key: string) {
            return (this as any)[key] as T | undefined;
        }

        public emitEvent<T = any>(name: string, detail: T = {} as T): void {
            this.dispatchEvent(new CustomEvent(name, { detail }));
        }

        setupGetters(): GettersProperties<ReturnType<G>> {
            const getterObj = gettersFn({
                props: this.getPropValue(),
                state: this.state,
                store: storeRegistry,
                el: this,
                slots: this.slots,
            });

            return Object.entries(getterObj).reduce((acc, [key, fn]) => ({
                ...acc,
                [key]: fn()
            }), {}) as GettersProperties<ReturnType<G>>;
        }

        setupComputed(): ComputedProperties<ReturnType<C>> {
            const computedObj = computedFn({
                props: this.getPropValue(),
                state: this.state,
                store: storeRegistry,
                el: this,
                slots: this.slots,
            });

            return Object.entries(computedObj).reduce((acc, [key, fn]) => ({
                ...acc,
                [key]: compute(() => fn())
            }), {}) as ComputedProperties<ReturnType<C>>;
        }

        setupActions(): ReturnType<A> {
            return actionsFn({
                props: this.getPropValue(),
                state: this.state,
                computed: this.computed,
                store: storeRegistry,
                el: this,
                slots: this.slots,
            }) as ReturnType<A>;
        }

        get context(): ComponentContext<InferProps<P>, S, G, C, A> {
            return {
                props: this.getPropValue(),
                state: this.state,
                getters: this.getters,
                computed: this.computed,
                actions: this.actions,
                el: this,
                slots: this.slots,
                store: storeRegistry,
            };
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

        getDefaultForType(type: PropDefinition['type']): any {
            switch (type) {
                case String: return '';
                case Number: return 0;
                case Boolean: return false;
                case Object: return {};
                case Array: return [];
                default: return null;
            }
        }

        parseAttributeValue(value: string, type: PropDefinition['type']): any {
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

        updateProp(name: keyof P, value: any) {
            this.props.value = {
                ...this.props.peek(),
                [name]: value,
            };
        }

        getPropValue() {
            return this.props.value;
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
    if (tagName) {
        customElements.define(tagName, CustomElement);
    }
}