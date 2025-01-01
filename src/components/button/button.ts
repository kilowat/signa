import { defineComponent, html } from "../../core";
import { StoreManager } from "../../core/store";


export default defineComponent({
    tagName: 'my-counter',
    state: { count: 0 },
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
        console.log('componnent liste')
    },
    render: ({ state, computed, actions }) => html`
        <div>
            <p >Count: ${state.value.count}</p>
            <p>Double: ${computed.doubleCount.value}</p>
            <p>Is Even: ${computed.isEven.value}</p>
            <button onclick=${() => actions.increment(1)}>+1</button>
            <button onclick=${actions.reset}>Reset</button>
        </div>
    `,
});

// Types
interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

interface TodoState {
    items: TodoItem[];
    filter: 'all' | 'active' | 'completed';
}

// Create store manager
const store = new StoreManager();

// Register todo store
const todoStore = store.registerModule('todos', {
    state: {
        items: [],
        filter: 'all'
    } as TodoState,

    computed: ({ state }) => ({
        filteredItems: () => {
            const items = state.value.items;
            switch (state.value.filter) {
                case 'active':
                    return items.filter(item => !item.completed);
                case 'completed':
                    return items.filter(item => item.completed);
                default:
                    return items;
            }
        },
        completedCount: () =>
            state.value.items.filter(item => item.completed).length,

        activeCount: () =>
            state.value.items.filter(item => !item.completed).length
    }),

    actions: ({ state }) => ({
        addTodo: (text: string) => {
            state.emit({
                items: [
                    ...state.value.items,
                    {
                        id: Date.now(),
                        text,
                        completed: false
                    }
                ]
            });
        },

        toggleTodo: (id: number) => {
            state.emit({
                items: state.value.items.map(item =>
                    item.id === id
                        ? { ...item, completed: !item.completed }
                        : item
                )
            });
        },

        setFilter: (filter: TodoState['filter']) => {
            state.emit({ filter });
        }
    })
});

// Usage
const todos = store.$('todo');

// Subscribe to changes
todos.subscribe(state => {
    console.log('State updated:', state);
});

// Use actions
todos.actions.addTodo('Learn TypeScript');
todos.actions.addTodo('Build Todo App');
todos.actions.toggleTodo(0);

// Use computed
console.log('Completed count:', todos.computed.completedCount.value);
console.log('Active count:', todos.computed.activeCount.value);
console.log('Filtered items:', todos.computed.filteredItems.value);