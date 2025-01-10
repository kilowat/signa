
import { app, def, html, useSignal, useComputed } from "@signa/core";

const myApi = { fetch: () => '1' }
type MyAPi = typeof myApi;

app.register('api', () => myApi)

export default def({
    tagName: 'signa-button',
    slots: ['header', 'footer'],
    props: {
        name: {
            type: String,
            default: 'test'
        }
    },
    setup({ props }) {
        console.log(props.name.value)
        const count = useSignal(0);
        const state = useSignal({ count: 0 })
        const someApi = app.get<MyAPi>('api');
        const inc = () => {
            count.value++;
            state.value = { count: state.value.count + 1 }
        }
        const isDouble = useComputed(() => count.value % 2 === 0);
        return {
            count,
            inc,
            isDouble,
            state,

        }
    },
    connected() {
        console.log(this.name.value)
    },
    render() {
        return html`
        <div>
            <div>State count: ${this.state.value.count}</div>
            <div>IsDouble: ${this.isDouble.value}</div>
            <div>Header slot result: ${this.slots.header}</div>
            <div>${this.count.value}</div>
            <div>Default slot result: ${this.slots.default}</div>
            <div>Footer slot result: ${this.slots.footer}</div>
            <div><button @click="${() => this.inc()}">inc</button></div>
            <prop-example data-example="${this.count.value}"></prop-example>
        </div>`;
    }
});

def({
    tagName: 'prop-example',
    props: {
        example: {
            type: Number,
            default: 0
        }
    },
    render() {
        return html`prop: ${this.example.value}`
    },
})