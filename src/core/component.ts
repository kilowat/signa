import { reactive } from 'uhtml/reactive';
import { effect, ReadonlySignal } from '@preact/signals-core';
import { State } from './state';

type ComputedFn<S> = (context: { state: State<S> }) => Record<string, (...args: any[]) => any>;
type ActionsFn<S, C> = (context: { state: State<S>; computed: ComputedProperties<C> }) => Record<string, (...args: any[]) => any>;
type ComputedProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => infer R ? ReadonlySignal<R> : never;
};

interface ListenerParams<S, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> extends Context<S, C, A> {
    newValue: S;
    oldValue: S;
}
interface Context<S, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    state: State<S>;
    computed: ComputedProperties<ReturnType<C>>;
    actions: ReturnType<A>;
    element: HTMLElement;
    slots: Record<string, Node[]>;
}

interface ComponentOptions<S, C extends ComputedFn<S>, A extends ActionsFn<S, ReturnType<C>>> {
    tagName: string;
    state?: S;
    computed?: C;
    actions?: A;
    connected?: (context: Context<S, C, A>) => void;
    render?: (context: Context<S, C, A>) => void;
    listen?: (params: ListenerParams<S, C, A>) => void;
    disconnected?: (context: Context<S, C, A>) => void;
}

export function defineComponent<
    S,
    C extends ComputedFn<S>,
    A extends ActionsFn<S, ReturnType<C>>
>(options: ComponentOptions<S, C, A>) {
    class CustomElement extends HTMLElement {

    }
    return CustomElement;
}

defineComponent({
    tagName: 'my-cmp',
    state: { count: 0 },
    computed: ({ state }) => ({
        double: () => state.value.count + 1,
        triple: () => state.value.count * 3,
    }),
    actions: (context) => ({
        inc: (amount: number) => {
            context.state.value.count += amount;
        },
        reset: () => {
            context.state.value.count = 0;
        },
    }),
    connected: (context) => {
        console.log(context.computed.double.value);
        console.log(context.computed.triple.value);
        context.actions.inc(5);
        context.actions.reset();
    },
});
