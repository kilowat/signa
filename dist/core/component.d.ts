import { State } from './state';
import { StoreRegistry } from './store';
type ConstructorToType<T> = T extends StringConstructor ? string : T extends NumberConstructor ? number : T extends BooleanConstructor ? boolean : T extends ArrayConstructor ? T[] : T extends ObjectConstructor ? Record<string, unknown> : T;
type ModelPropDefinition<T> = {
    type: TypeConstructor;
    default?: T;
    model?: {
        __type: T;
    };
};
type SimplePropDefinition<T extends TypeConstructor> = {
    type: T;
    default?: ConstructorToType<T>;
};
type PropDefinition<T = unknown> = T extends TypeConstructor ? SimplePropDefinition<T> : ModelPropDefinition<T>;
type InferPropType<T> = T extends SimplePropDefinition<infer U> ? ConstructorToType<U> : T extends ModelPropDefinition<infer M> ? M : never;
type InferProps<T extends Record<string, PropDefinition>> = {
    [K in keyof T]: InferPropType<T[K]>;
};
export type ComputedProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any ? ReturnType<C[K]> : never;
};
export type GettersProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any ? ReturnType<C[K]> : never;
};
type TypeConstructor = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor;
type BaseContext<P, S> = {
    props: P;
    el: CustomHtmlElement;
    slots: Record<string, Node[]>;
    state: State<S>;
    store: StoreRegistry;
};
type GettersFn<P, S> = (context: BaseContext<P, S>) => Record<string, () => any>;
type ComputedFn<P, S> = (context: BaseContext<P, S>) => Record<string, () => any>;
type ActionsFn<P, S, C> = (context: BaseContext<P, S> & {
    computed: ComputedProperties<C>;
}) => Record<string, (...args: any[]) => any>;
export interface ComponentContext<P, S, G extends GettersFn<P, S>, C extends ComputedFn<P, S>, A extends ActionsFn<P, S, ReturnType<C>>> {
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
type ComponentOptions<P extends Record<string, PropDefinition>, S, G extends GettersFn<InferProps<P>, S>, C extends ComputedFn<InferProps<P>, S>, A extends ActionsFn<InferProps<P>, S, ReturnType<C>>> = {
    tagName: string;
    props?: P;
    state?: S;
    getters?: G;
    computed?: C;
    actions?: A;
    connected?: (ctx: ComponentContext<InferProps<P>, S, G, C, A>) => void;
    render?: (ctx: ComponentContext<InferProps<P>, S, G, C, A>) => unknown;
    listen?: (ctx: ComponentContext<InferProps<P>, S, G, C, A> & {
        newValue: S;
        oldValue: S;
    }) => void;
    disconnected?: (ctx: ComponentContext<InferProps<P>, S, G, C, A>) => void;
};
export declare function defineComponent<P extends Record<string, PropDefinition>, S, G extends GettersFn<InferProps<P>, S>, C extends ComputedFn<InferProps<P>, S>, A extends ActionsFn<InferProps<P>, S, ReturnType<C>>>(options: ComponentOptions<P, S, G, C, A>): void;
export {};
