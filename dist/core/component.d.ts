import { ReadonlySignal } from '@preact/signals-core';
import { State } from './state';
import { GlobalStore, globalStore } from './store';
type ComputedFn<S> = (context: {
    state: State<S>;
    store: GlobalStore;
}) => Record<string, (...args: any[]) => any>;
type ActionsFn<S, C> = (context: {
    state: State<S>;
    computed: ComputedProperties<C>;
    store: GlobalStore;
}) => Record<string, (...args: any[]) => any>;
type GettersFn<S> = ComputedFn<S>;
export type ComputedProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any ? ReadonlySignal<ReturnType<C[K]>> : never;
};
export type GettersProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any ? ReturnType<C[K]> : never;
};
interface BaseContext<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    state: State<S>;
    getters: GettersProperties<ReturnType<G>>;
    computed: ComputedProperties<ReturnType<C>>;
    actions: ReturnType<A>;
    store: typeof globalStore;
}
interface ComponentContext<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> extends BaseContext<S, G, C, A> {
    element: HTMLElement;
    slots: Record<string, Node[]>;
}
interface ListenerParams<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> extends ComponentContext<S, G, C, A> {
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
export declare function defineComponent<S, G extends GettersFn<S>, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>>(options: ComponentOptions<S, G, C, A>): void;
export {};
