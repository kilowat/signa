import { reactive } from 'uhtml/reactive';
import { effect } from '@preact/signals-core';
import { State } from './state';

type ComputedFn<S> = (context: { state: State<S> }) => Record<string, any>;

interface ComponentOptions<S, C extends ComputedFn<S>> {
    tagName: string,
    state?: S,
    computed?: C,
    connected?: (context: {
        state: State<S>,
        computed: ReturnType<C>,
        actions: any,
        element: any,
    }) => void,
}

export function defineComponent<
    S,
    C extends ComputedFn<S>
>(options: ComponentOptions<S, C>) {
    class CustomElement extends HTMLElement {

    }
    return CustomElement;
}

defineComponent({
    tagName: 'my-cmp',
    computed: ({ state }) => ({
        double: state.value.count + 1,
        triple: state.value.count * 3
    }),
    connected: (context) => {
        console.log(context.computed.double);
        console.log(context.computed.triple);
    },
    state: { count: 0 },
});