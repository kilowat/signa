// src/components/button/button.ts
import { app, defineComponent, html, useState } from "signa";
var myApi = { fetch: () => "1" };
app.register("api", () => myApi);
var button_default = defineComponent({
  tagName: "signa-button",
  slots: ["header", "footer"],
  props: {
    name: {
      type: String,
      default: "test"
    }
  },
  setup({ props, app: app2 }) {
    const count = useState(0);
    const someApi = app2.get("api");
    const inc = () => {
      count.value++;
    };
    return {
      count,
      inc
    };
  },
  connected() {
  },
  render() {
    return html`<div> <div>Header slot result: ${this.slots.header}</div> <div>${this.count.value}</div> <div>Default slot result: ${this.slots.default}</div> <div>Footer slot result: ${this.slots.footer}</div> <div><button @click="${() => this.inc()}">inc</button></div> <prop-example data-example="${this.count.value}"></prop-example> </div>`;
  }
});
defineComponent({
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
//# sourceMappingURL=signa.components.esm.v1.0.0.js.map
