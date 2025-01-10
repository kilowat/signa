// packages/components/src/button/button.ts
import { app, computed, def, html, signal } from "@signa/core";
var myApi = { fetch: () => "1" };
app.register("api", () => myApi);
var button_default = def({
  tagName: "signa-button",
  slots: ["header", "footer"],
  props: {
    name: {
      type: String,
      default: "test"
    }
  },
  setup({ props }) {
    const count = signal(0);
    const state = signal({ count: 0 });
    const someApi = app.get("api");
    const inc = () => {
      count.value++;
      state.valueCopy({ count: state.value.count + 1 });
    };
    const isDouble = computed(() => count.value % 2 === 0);
    return {
      count,
      inc,
      isDouble,
      state
    };
  },
  connected() {
  },
  render() {
    return html`<div> <div>State count: ${this.state.value.count}</div> <div>IsDouble: ${this.isDouble.value}</div> <div>Header slot result: ${this.slots.header}</div> <div>${this.count.value}</div> <div>Default slot result: ${this.slots.default}</div> <div>Footer slot result: ${this.slots.footer}</div> <div><button @click="${() => this.inc()}">inc</button></div> <prop-example data-example="${this.count.value}"></prop-example> </div>`;
  }
});
def({
  tagName: "prop-example",
  props: {
    example: {
      type: Number,
      default: 0
    }
  },
  render() {
    return html`prop: ${this.example.value}`;
  }
});
export {
  button_default as Button
};
