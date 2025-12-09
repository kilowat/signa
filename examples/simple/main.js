const { defComponent, defStore, eventBus, provide, inject, getAppContext, html } = signa;

provide('api', {
    getDate: () => new Date().toDateString(),
});

console.log(inject('api').getDate());

eventBus.on('counter:changed', (payload) => {
    console.log(payload);
})

eventBus.emit('counter:changed', { value: 1 });

defStore('counterStore', ({ signal }) => {
    const count = signal(0);
    const inc = () => count.value++;
    return {
        count,
        inc,
    }
})

/**
 * 
 * @param {Signal<string>} title 
 */
const buildSomePartTempltate = (title) => html`<h3>${title.value}</h3>`

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
    } = ctx;

    const header = slot('header');
    const footer = slot('footer');

    //Current created root dom element
    console.log($this)
    // Props
    const countProp = prop({
        name: 'count',
        type: Number,
        default: 0
    });

    const boolProp = prop({
        name: 'boolValue',
        type: Boolean,
        default: false
    });

    const arrayProp = prop({
        name: 'arrayValue',
        type: Array,
        default: []
    });

    const objectProp = prop({
        name: 'objectProp',
        type: Object,
        default: null
    });

    const counterStore = store('counterStore');
    const count = signal(countProp);
    const title = signal('My title');

    effect(() => {
        return () => console.log('unmount');
    })


    return () => html`
        <div>
            <div>${header}</div>
            <div>${slot.default}</div>
            <div>${footer}</div>
        </div>
        <div>Part template:${buildSomePartTempltate(title)}</div>
        <div>
            <div>bool prop: ${boolProp}</div>
            <div>array prop: ${JSON.stringify(arrayProp)}</div>
            <div>object prop: ${JSON.stringify(objectProp)}</div>
        </div>
        <div>
            CountProp: ${countProp}
        </div>
        <div>Local counter: ${count.value}</div>
        <div>
            CountStore: ${counterStore.count.value}
            <button onclick=${() => counterStore.inc()}>Increment store</button>
            <button onclick=${() => count.value++}>Increment local count</button>
        </div>
    `;
});

defComponent('parent-component', ({ signal, html }) => {
    const count = signal(10);
    return () => html`
        <div>
            <div>Parent: ${count.value}</div>
            <button onclick=${() => count.value++}>+</button>
            <child-component .count=${count.value} .refCount=${count} .myClick=${() => count.value++}></child-component>
        </div>
    `;
});

defComponent('child-component', ({ prop, html, signal }) => {
    const countInitValue = prop({ name: 'count', type: Number });
    const count = signal(countInitValue);
    const refCount = prop({ name: 'refCount', type: 'Signal', });
    const myClick = prop({ name: 'myClick', type: Function });

    return () => html`
        <div>
            Click: ${refCount.value} <button onclick=${myClick}>Change</button>
        </div>
        <div>
            Parent signal: ${refCount.value}
        </div>
        <div>
            Local count: ${count.value} <button onclick=${() => count.value++}>Change</button>
        </div>
    `
});