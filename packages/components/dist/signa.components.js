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
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // external-globals:@signa/core
  var require_core = __commonJS({
    "external-globals:@signa/core"(exports, module) {
      module.exports = signa;
    }
  });

  // packages/components/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Button: () => button_default
  });

  // packages/components/src/button/button.ts
  var import_core = __toESM(require_core(), 1);
  (0, import_core.def)("counter-component-t", ({ signal, effect, computed, html, prop, slot }) => {
    const header = slot("header");
    const footer = slot("footer");
    const initialValue = prop({
      name: "initial-value",
      type: Number,
      default: 0
    });
    const count = signal(initialValue.value);
    return () => html`<div> <header>${header}</header> <main>${slot.default}</main> <footer>${footer}</footer> </div> <div> Count: ${count.value} <button onclick=${() => count.value++}>Increment</button> </div>`;
  });
  var button_default = {};
  return __toCommonJS(src_exports);
})();
