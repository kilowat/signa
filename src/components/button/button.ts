
import { defineStore, defineComponent, html, State, createState } from "signa/core";

const counterStore = defineStore({
    key: 'counter',
    state: { count: 0 },
    computed: () => ({
        double: () => true,
    })
})

// example def types
declare module "signa/core" {
    interface GlobalStore {
        counter: typeof counterStore
    }
}

defineComponent({
    tagName: 'my-counter',
    state: { count: 0 },
    props: {
        val: {
            type: Number,
            default: 20,
        }
    },
    getters: (context) => ({
        counterStore: () => {
            return context.store.$('counter')
        },
        hi: () => 'hi',
    }),
    computed: ({ state, props }) => {
        console.log(props)
        return ({
            doubleCount: () => state.value.count + props.val,
            isEven: () => state.value.count % 2 === 0,
        });
    },
    actions: ({ state }) => ({
        increment: (amount: number) => {
            state.emit({ count: state.value.count + amount });
        },
        reset: () => {
            state.emit({ count: 0 });
        }
    }),
    listen(params) {

    },
    render: (context) => {
        const { state, computed, actions, getters: { counterStore } } = context;
        return html`
        <div>
            <p>Count test: ${state.value.count}</p>
            <p>Double: ${computed.doubleCount.value}</p>
            <p>Is Even: ${computed.isEven.value}</p>
            <button onclick=${() => actions.increment(1)}>+1</button>
            <button onclick=${actions.reset}>Reset</button>
        </div>
    `;
    },
});

defineComponent({
    tagName: 'my-counter-2',
    state: { count: 0 },
    props: {
        count: {
            type: Number,
            default: 0
        }
    },
    getters: (context) => ({
        hi: () => 'hi',
        counterStore: () => context.store.$('counter'),
    }),
    computed: ({ state }) => ({
        doubleCount: () => state.value.count * 2,
        isEven: () => state.value.count % 2 === 0,
    }),
    actions: ({ state }) => ({
        increment: (amount: number) => {
            state.emit({ count: state.value.count + amount });
        },
        reset: () => {
            state.emit({ count: 0 });
        }
    }),
    listen(params) {

    },
    render: ({ props, state, computed, actions, getters: { counterStore } }) => {
        return html`
        <div>
            counter 2 component props value ${props.count}
            <p>Count: ${state.value.count}</p>
            <p>Double: ${computed.doubleCount.value}</p>
            <p>Is Even: ${computed.isEven.value}</p>
            <button onclick=${() => actions.increment(1)}>+1</button>
            <button onclick=${actions.reset}>Reset</button>
            <my-component  data-count="${state.value.count}"></my-component>
        </div>
    `;
    },
});

defineComponent({
    tagName: 'my-component',
    state: { count: 0 },
    props: {
        count: {
            type: Number,
            default: 0
        }
    },
    getters: (context) => ({
        hi: () => 'hi',
        counterStore: () => context.store.$('counter'),
    }),
    computed: ({ state }) => ({
        doubleCount: () => state.value.count * 2,
        isEven: () => state.value.count % 2 === 0,
    }),
    actions: ({ state }) => ({
        increment: (amount: number) => {
            state.emit({ count: state.value.count + amount });
        },
        reset: () => {
            state.emit({ count: 0 });
        }
    }),
    listen(params) {

    },
    render: ({ props, state, computed, actions, getters: { counterStore } }) => {
        return html`
        <div>
            <div>props: ${props.count}</div>
            <p >Count: ${state.value.count}</p>
            <p>Double: ${computed.doubleCount.value}</p>
            <p>Is Even: ${computed.isEven.value}</p>
            <button onclick=${() => actions.increment(1)}>+1</button>
            <button onclick=${actions.reset}>Reset</button>
         
        </div>
    `;
    },
});

const counterStateValue = { count: 0 };
const useActions = (state: State<typeof counterStateValue>) => ({
    inc: () => state.emit({ count: state.value.count + 1 })
})


// owner + external composition state actions ...
defineComponent({
    tagName: 'parent-example-cmp-2',
    state: { example: 0, ...counterStateValue }, // owner local state + external
    actions: ({ state }) => ({
        ...useActions(state),
        myinc: () => { state.emit({ example: state.value.example + 1 }) }
    }),
    render(context) {
        return html`${context.state.value.example}<example-cmp @button-click="${() => console.log('button-click event')}"></example-cmp>`
    },
})

defineComponent({
    tagName: 'example-cmp',
    render(context) {
        return html`<button @click="${() => context.el.emitEvent('button-click')}">Click</button>`
    },
})