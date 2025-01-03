
import { defineStore, defineComponent, html, prop } from "signa/core";

const counterStore = defineStore({
    key: 'counter',
    state: { count: 0 }
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
    getters: (context) => ({
        counterStore: () => {
            const s = context.store.$('counter');
            return context.store.$('counter')
        },
        hi: () => 'hi',
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
    render: ({ state, computed, actions, getters: { counterStore } }) => {
        return html`
        <div>
            <p >Count: ${state.value.count}</p>
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
    getters: (context) => ({
        hi: () => 'hi',
        counterStore: () => ''//context.store.counter, // Автоматическая типизация
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
        console.log(params.getters.hi)
    },
    render: ({ state, computed, actions, getters: { counterStore } }) => {
        return html`
        <div>
            <p >Count: ${state.value.count}</p>
            <p>Double: ${computed.doubleCount.value}</p>
            <p>Is Even: ${computed.isEven.value}</p>
            <button onclick=${() => actions.increment(1)}>+1</button>
            <button onclick=${actions.reset}>Reset</button>
            <my-component .count=${1} data-count="${state.value.count}"></my-component>
        </div>
    `;
    },
});

interface User {
    id: number;
    name: string;
    email: string;
}

const componentProps = {
    title: {
        type: String,
        default: ''
    },

    count: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: false
    },
    // Для сложных типов используем prop<T>
    users: prop<User[]>({
        type: Array,
        default: []
    }),

    selectedUser: prop<User>({
        type: Object,
        default: undefined
    })
} as const;

defineComponent({
    tagName: 'my-component',
    props: componentProps,
    connected(context) {
        const count = context.element.$<number>('count') // Проброс через uthml
        console.log(`count from uhtml prop ${count}`)
    },
    state: {
        loading: false
    },
    render: ({ props }) => {
        return html`<div>${props.count}<div>`
    }
});