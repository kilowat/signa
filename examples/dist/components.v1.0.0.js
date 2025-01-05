"use strict";
var SignaCmp = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/components/index.ts
  var index_exports = {};
  __export(index_exports, {
    Button: () => Button
  });

  // src/components/button/button.ts
  var import_core = __require("signa/core");
  var counterStore = (0, import_core.defineStore)({
    key: "counter",
    state: { count: 0 },
    computed: () => ({
      double: () => true
    })
  });
  (0, import_core.defineComponent)({
    tagName: "my-counter",
    state: { count: 0 },
    props: {
      val: {
        type: Number,
        default: 20
      }
    },
    listen(params) {
    },
    connected(ctx) {
    },
    disconnected(ctx) {
    },
    getters: (context) => ({
      counterStore: () => {
        return context.store.$("counter");
      },
      hi: () => "hi"
    }),
    computed: ({ state, props }) => {
      console.log(props);
      return {
        doubleCount: () => state.value.count + props.val,
        isEven: () => state.value.count % 2 === 0
      };
    },
    actions: ({ state }) => ({
      increment: (amount) => {
        state.emit({ count: state.value.count + amount });
      },
      reset: () => {
        state.emit({ count: 0 });
      }
    }),
    render: (context) => {
      const { state, computed, actions, getters: { counterStore: counterStore2 } } = context;
      return import_core.html`<div> <p>Count test: ${state.value.count}</p> <p>Double: ${computed.doubleCount}</p> <p>Is Even: ${computed.isEven}</p> <button onclick=${() => actions.increment(1)}>+1</button> <button onclick=${actions.reset}>Reset</button> </div>`;
    }
  });
  (0, import_core.defineComponent)({
    tagName: "my-counter-2",
    state: { count: 0 },
    props: {
      count: {
        type: Number,
        default: 0
      }
    },
    getters: (context) => ({
      hi: () => "hi",
      counterStore: () => context.store.$("counter")
    }),
    computed: ({ state }) => ({
      doubleCount: () => state.value.count * 2,
      isEven: () => state.value.count % 2 === 0
    }),
    actions: ({ state }) => ({
      increment: (amount) => {
        state.emit({ count: state.value.count + amount });
      },
      reset: () => {
        state.emit({ count: 0 });
      }
    }),
    listen(params) {
    },
    render: ({ props, state, computed, actions, getters: { counterStore: counterStore2, hi } }) => {
      return import_core.html`<div> counter 2 component props value ${props.count} <p>Count: ${state.value.count}</p> <p>Double: ${computed.doubleCount}</p> <p>Is Even: ${computed.isEven}</p> <button onclick=${() => actions.increment(1)}>+1</button> <button onclick=${actions.reset}>Reset</button> <my-component data-count="${state.value.count}"></my-component> </div>`;
    }
  });
  (0, import_core.defineComponent)({
    tagName: "my-component",
    state: { count: 0 },
    props: {
      count: {
        type: Number,
        default: 0
      }
    },
    getters: (context) => ({
      hi: () => "hi",
      counterStore: () => context.store.$("counter")
    }),
    computed: ({ state }) => ({
      doubleCount: () => state.value.count * 2,
      isEven: () => state.value.count % 2 === 0
    }),
    actions: ({ state }) => ({
      increment: (amount) => {
        state.emit({ count: state.value.count + amount });
      },
      reset: () => {
        state.emit({ count: 0 });
      }
    }),
    listen(params) {
    },
    render: ({ props, state, computed, actions, getters: { counterStore: counterStore2 } }) => {
      return import_core.html`<div> <div>props: ${props.count}</div> <p >Count: ${state.value.count}</p> <button onclick=${() => actions.increment(1)}>+1</button> <button onclick=${actions.reset}>Reset</button> </div>`;
    }
  });
  var counterStateValue = { count: 0 };
  var useActions = (state) => ({
    inc: () => state.emit({ count: state.value.count + 1 })
  });
  (0, import_core.defineComponent)({
    tagName: "parent-example-cmp-2",
    state: { example: 0, ...counterStateValue },
    // owner local state + external
    actions: ({ state }) => ({
      ...useActions(state),
      myinc: () => {
        state.emit({ example: state.value.example + 1 });
      }
    }),
    render(context) {
      return import_core.html`${context.state.value.example}<example-cmp @button-click="${() => console.log("button-click event")}"></example-cmp>`;
    }
  });
  (0, import_core.defineComponent)({
    tagName: "example-cmp",
    render(context) {
      return import_core.html`<button @click="${() => context.el.emitEvent("button-click")}">Click</button>`;
    }
  });
  var exState = (0, import_core.createState)(0);
  var inc = exState.value + 1;
  (0, import_core.defineComponent)({
    tagName: "example-cmp-2",
    render(context) {
      return import_core.html`<button @click="${() => context.el.emitEvent("button-click")}">Click</button>`;
    }
  });
  var Button = (0, import_core.defineComponent)({
    tagName: "signa-button",
    props: {
      variant: { type: String, default: "primary" }
    },
    render: ({ slots }) => {
      console.log(slots.default);
      return import_core.html`<button class="signa-button"> ${slots.default} </button>`;
    }
  });
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=components.v1.0.0.js.map
