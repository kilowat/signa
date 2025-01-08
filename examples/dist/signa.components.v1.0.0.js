const require = globalThis.require || (() => {  });
"use strict";
var signaComponents = (() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/components/button/button.ts
  var import_signa = __require("signa");
  var myApi = { fetch: () => "1" };
  import_signa.app.register("api", () => myApi);
  var button_default = (0, import_signa.defineComponent)({
    tagName: "signa-button",
    slots: ["header", "footer"],
    props: {
      name: {
        type: String,
        default: "test"
      }
    },
    setup({ props, app: app2 }) {
      const count = (0, import_signa.useState)(0);
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
      return import_signa.html`<div> <div>Header slot result: ${this.slots.header}</div> <div>${this.count.value}</div> <div>Default slot result: ${this.slots.default}</div> <div>Footer slot result: ${this.slots.footer}</div> <div><button @click="${() => this.inc()}">inc</button></div> <prop-example data-example="${this.count.value}"></prop-example> </div>`;
    }
  });
  (0, import_signa.defineComponent)({
    tagName: "prop-example",
    props: {
      example: {
        type: Number,
        default: 0
      }
    },
    render() {
      return import_signa.html`prop: ${this.example.value}`;
    }
  });
})();
//# sourceMappingURL=signa.components.v1.0.0.js.map
