import { def } from "@signa/core";

def('counter-component-t', ({ signal, effect, computed, html, prop, slot }) => {
    const header = slot('header');
    const footer = slot('footer');

    const initialValue = prop({
        name: 'initial-value',
        type: Number,
        default: 0
    });

    const count = signal(initialValue.value);

    return () => html`
        <div>
            <header>${header}</header>
            <main>${slot.default}</main>
            <footer>${footer}</footer>
        </div>
        <div>
            Count: ${count.value}
            <button onclick=${() => count.value++}>Increment</button>
        </div>
    `;
});
export default {}