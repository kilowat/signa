import { defineComponent, html } from "../../core";
import { createStore, registerStore } from "../../core/store";

//global store
const counterStore = createStore({
    state: { count: 0 },
    getters: (context) => ({
        hi: () => 'hi'
    }),
    computed: ({ state }) => ({
        isEven: () => state.value.count % 2 === 0,
    }),
    actions: ({ state }) => ({
        inc: () => state.emit({ count: state.value.count + 1 })
    })
})
type CounterStore = typeof counterStore;
//inject then can proivder in any componenets
registerStore('counter', counterStore);

defineComponent({
    tagName: 'my-counter',
    state: { count: 0 },
    getters: (context) => ({
        hi: () => 'hi',
        counterStore: () => context.store.counter as CounterStore,
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
             <button @click="${() => counterStore.actions.inc()}">Count store: ${counterStore.state.value.count}</button> 
            <p >Count: ${state.value.count}</p>
            <p>Double: ${computed.doubleCount.value}</p>
            <p>Is Even: ${computed.isEven.value}</p>
            <button onclick=${() => actions.increment(1)}>+1</button>
            <button onclick=${actions.reset}>Reset</button>
        </div>
    `;
    },
});