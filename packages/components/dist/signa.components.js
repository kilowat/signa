"use strict";
var signaComponents = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // external-globals:@signa/core
  var require_core = __commonJS({
    "external-globals:@signa/core"(exports, module) {
      module.exports = signa;
    }
  });

  // packages/components/src/button/button.ts
  var import_core = __toESM(require_core(), 1);
  var myApi = { fetch: () => "1" };
  import_core.app.register("api", () => myApi);
  var button_default = (0, import_core.def)({
    tagName: "signa-button",
    slots: ["header", "footer"],
    props: {
      name: {
        type: String,
        default: "test"
      }
    },
    setup({ props, app: app2 }) {
      const count = (0, import_core.useState)(0);
      const state = (0, import_core.useState)({ count: 0 });
      const someApi = app2.get("api");
      const inc = () => {
        count.value++;
        state.emit({ count: state.value.count + 1 });
      };
      const isDouble = (0, import_core.computed)(() => count.value % 2 === 0);
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
      return import_core.html`<div> <div>State count: ${this.state.value.count}</div> <div>IsDouble: ${this.isDouble.value}</div> <div>Header slot result: ${this.slots.header}</div> <div>${this.count.value}</div> <div>Default slot result: ${this.slots.default}</div> <div>Footer slot result: ${this.slots.footer}</div> <div><button @click="${() => this.inc()}">inc</button></div> <prop-example data-example="${this.count.value}"></prop-example> </div>`;
    }
  });
  (0, import_core.def)({
    tagName: "prop-example",
    props: {
      example: {
        type: Number,
        default: 0
      }
    },
    render() {
      return import_core.html`prop: ${this.example.value}`;
    }
  });
})();
//# sourceMappingURL=signa.components.js.map
