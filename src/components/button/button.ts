
import { app, computed, def, html, useState } from "signa";

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
    setup({ props, app }) {
        const count = useState(0);
        const someApi = app.get<MyAPi>('api');

        const inc = () => {
            count.value++;
        }
        const isDouble = computed(() => count.value % 2 === 0);
        return {
            count,
            inc,
            isDouble,
        }
    },
    connected() {

    },
    render() {
        return html`
        <div>
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