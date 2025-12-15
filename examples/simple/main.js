defStore('counterStore', (ctx) => {
    console.log(ctx);
    const count = ctx.signal(0);
    const inc = () => count.value++;
    return {
        count,
        inc,
    }
})
//composable
defStore('useCounter', ({ signal }) =>
    (value) => {
        const count = signal(value);
        const inc = () => count.value++;
        return {
            count,
            inc,
        }
    }
)

defComponent('counter-component', (ctx) => {
    const {
        $this,
        signal,
        effect,
        computed,
        html,
        prop,
        slot,
        render,
        store,
        inject,
        provide,
        eventBus,
        createRouter,
    } = ctx;

    const header = slot('header');
    const footer = slot('footer');

    //Current created root dom element
    console.log($this)
    // Props
    const countProp = prop('count', {
        type: Number,
        attribute: true,
        default: 0
    });

    const boolProp = prop('boolValue', {
        type: Boolean,
        default: false
    });

    const arrayProp = prop('arrayValue', {
        type: Array,
        default: []
    });

    const objectProp = prop('objectProp', {
        type: Object,
        default: null
    });

    const counterStore = store('counterStore');
    const counterState = store('useCounter')(10);

    const count = signal(countProp.value);
    const title = signal('My title');

    effect(() => {
        console.log('mount');
        return () => console.log('unmount');
    })

    return () => html`
        <div>
            <div>${header}</div>
            <div>${slot.default}</div>
            <div>${footer}</div>
        </div>
        <div>
            <div>bool prop: ${boolProp.value}</div>
            <div>array prop: ${JSON.stringify(arrayProp.value)}</div>
            <div>object prop: ${JSON.stringify(objectProp.value)}</div>
        </div>
        <div>
            CountProp: ${countProp.value}
        </div>
        <div>Local counter: ${count.value}</div>
        <div>
            CountStore: ${counterStore.count.value}
            <button onclick=${() => counterStore.inc()}>Increment store</button>
            <button onclick=${() => count.value++}>Increment local count</button>
        </div>
        <div>
            CounterState: ${counterState.count.value}
            <button onclick=${() => counterState.inc()}>Increment counter state</button>
        </div>
    `;
});

defComponent('parent-component', ({ signal, html }) => {
    const count = signal(10);
    return () => html`
        <div>
            <div>Parent: ${count.value}</div>
            <button onclick=${() => count.value++}>+</button>
            <child-component .count=${count}  .myClick=${() => count.value++}></child-component>
        </div>
    `;
});

defComponent('child-component', ({ prop, html, signal }) => {
    const propCount = prop('count', { type: Number });
    const count = signal(propCount.value);
    const myClick = prop('myClick', { type: Function });

    return () => html`
    <div>
    propCount: ${propCount.value}
    </div>
        <div>
          <button onclick=${myClick}>Change</button>
        </div>
        <div>
            Local count: ${count.value} <button onclick=${() => count.value++}>Change</button>
     </div>
    `
});