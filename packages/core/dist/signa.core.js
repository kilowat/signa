"use strict";
var signa = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };

  // packages/core/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    app: () => app,
    computed: () => computed,
    def: () => def,
    effect: () => E,
    html: () => html,
    htmlFor: () => htmlFor,
    useState: () => useState
  });

  // node_modules/udomdiff/esm/index.js
  var esm_default = (parentNode, a2, b2, get, before) => {
    const bLength = b2.length;
    let aEnd = a2.length;
    let bEnd = bLength;
    let aStart = 0;
    let bStart = 0;
    let map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? get(b2[bStart - 1], -0).nextSibling : get(b2[bEnd], 0) : before;
        while (bStart < bEnd)
          parentNode.insertBefore(get(b2[bStart++], 1), node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a2[aStart]))
            parentNode.removeChild(get(a2[aStart], -1));
          aStart++;
        }
      } else if (a2[aStart] === b2[bStart]) {
        aStart++;
        bStart++;
      } else if (a2[aEnd - 1] === b2[bEnd - 1]) {
        aEnd--;
        bEnd--;
      } else if (a2[aStart] === b2[bEnd - 1] && b2[bStart] === a2[aEnd - 1]) {
        const node = get(a2[--aEnd], -0).nextSibling;
        parentNode.insertBefore(
          get(b2[bStart++], 1),
          get(a2[aStart++], -0).nextSibling
        );
        parentNode.insertBefore(get(b2[--bEnd], 1), node);
        a2[aEnd] = b2[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i2 = bStart;
          while (i2 < bEnd)
            map.set(b2[i2], i2++);
        }
        if (map.has(a2[aStart])) {
          const index = map.get(a2[aStart]);
          if (bStart < index && index < bEnd) {
            let i2 = aStart;
            let sequence = 1;
            while (++i2 < aEnd && i2 < bEnd && map.get(a2[i2]) === index + sequence)
              sequence++;
            if (sequence > index - bStart) {
              const node = get(a2[aStart], 0);
              while (bStart < index)
                parentNode.insertBefore(get(b2[bStart++], 1), node);
            } else {
              parentNode.replaceChild(
                get(b2[bStart++], 1),
                get(a2[aStart++], -1)
              );
            }
          } else
            aStart++;
        } else
          parentNode.removeChild(get(a2[aStart++], -1));
      }
    }
    return b2;
  };

  // node_modules/uhtml/esm/utils.js
  var { isArray } = Array;
  var { getPrototypeOf, getOwnPropertyDescriptor } = Object;
  var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  var empty = [];
  var newRange = () => document.createRange();
  var set = (map, key, value) => {
    map.set(key, value);
    return value;
  };
  var gPD = (ref2, prop) => {
    let desc;
    do {
      desc = getOwnPropertyDescriptor(ref2, prop);
    } while (!desc && (ref2 = getPrototypeOf(ref2)));
    return desc;
  };
  var find = (content, path) => path.reduceRight(childNodesIndex, content);
  var childNodesIndex = (node, i2) => node.childNodes[i2];

  // node_modules/domconstants/esm/constants.js
  var ELEMENT_NODE = 1;
  var COMMENT_NODE = 8;
  var DOCUMENT_FRAGMENT_NODE = 11;

  // node_modules/custom-function/esm/factory.js
  var { setPrototypeOf } = Object;
  var factory_default = (Class) => {
    function Custom(target) {
      return setPrototypeOf(target, new.target.prototype);
    }
    Custom.prototype = Class.prototype;
    return Custom;
  };

  // node_modules/uhtml/esm/range.js
  var range;
  var range_default = (firstChild, lastChild, preserve) => {
    if (!range)
      range = newRange();
    if (preserve)
      range.setStartAfter(firstChild);
    else
      range.setStartBefore(firstChild);
    range.setEndAfter(lastChild);
    range.deleteContents();
    return firstChild;
  };

  // node_modules/uhtml/esm/persistent-fragment.js
  var remove = ({ firstChild, lastChild }, preserve) => range_default(firstChild, lastChild, preserve);
  var checkType = false;
  var diffFragment = (node, operation) => checkType && node.nodeType === DOCUMENT_FRAGMENT_NODE ? 1 / operation < 0 ? operation ? remove(node, true) : node.lastChild : operation ? node.valueOf() : node.firstChild : node;
  var comment = (value) => document.createComment(value);
  var _firstChild, _lastChild, _nodes;
  var PersistentFragment = class extends factory_default(DocumentFragment) {
    constructor(fragment) {
      super(fragment);
      __privateAdd(this, _firstChild, comment("<>"));
      __privateAdd(this, _lastChild, comment("</>"));
      __privateAdd(this, _nodes, empty);
      this.replaceChildren(...[
        __privateGet(this, _firstChild),
        ...fragment.childNodes,
        __privateGet(this, _lastChild)
      ]);
      checkType = true;
    }
    get firstChild() {
      return __privateGet(this, _firstChild);
    }
    get lastChild() {
      return __privateGet(this, _lastChild);
    }
    get parentNode() {
      return __privateGet(this, _firstChild).parentNode;
    }
    remove() {
      remove(this, false);
    }
    replaceWith(node) {
      remove(this, true).replaceWith(node);
    }
    valueOf() {
      const { parentNode } = this;
      if (parentNode === this) {
        if (__privateGet(this, _nodes) === empty)
          __privateSet(this, _nodes, [...this.childNodes]);
      } else {
        if (parentNode) {
          let { firstChild, lastChild } = this;
          __privateSet(this, _nodes, [firstChild]);
          while (firstChild !== lastChild)
            __privateGet(this, _nodes).push(firstChild = firstChild.nextSibling);
        }
        this.replaceChildren(...__privateGet(this, _nodes));
      }
      return this;
    }
  };
  _firstChild = new WeakMap();
  _lastChild = new WeakMap();
  _nodes = new WeakMap();

  // node_modules/uhtml/esm/handler.js
  var setAttribute = (element, name, value) => element.setAttribute(name, value);
  var removeAttribute = (element, name) => element.removeAttribute(name);
  var aria = (element, value) => {
    for (const key in value) {
      const $ = value[key];
      const name = key === "role" ? key : `aria-${key}`;
      if ($ == null)
        removeAttribute(element, name);
      else
        setAttribute(element, name, $);
    }
    return value;
  };
  var listeners;
  var at = (element, value, name) => {
    name = name.slice(1);
    if (!listeners)
      listeners = /* @__PURE__ */ new WeakMap();
    const known2 = listeners.get(element) || set(listeners, element, {});
    let current = known2[name];
    if (current && current[0])
      element.removeEventListener(name, ...current);
    current = isArray(value) ? value : [value, false];
    known2[name] = current;
    if (current[0])
      element.addEventListener(name, ...current);
    return value;
  };
  var hole = (detail2, value) => {
    const { t: node, n: hole2 } = detail2;
    let nullish = false;
    switch (typeof value) {
      case "object":
        if (value !== null) {
          (hole2 || node).replaceWith(detail2.n = value.valueOf());
          break;
        }
      case "undefined":
        nullish = true;
      default:
        node.data = nullish ? "" : value;
        if (hole2) {
          detail2.n = null;
          hole2.replaceWith(node);
        }
        break;
    }
    return value;
  };
  var className = (element, value) => maybeDirect(
    element,
    value,
    value == null ? "class" : "className"
  );
  var data = (element, value) => {
    const { dataset } = element;
    for (const key in value) {
      if (value[key] == null)
        delete dataset[key];
      else
        dataset[key] = value[key];
    }
    return value;
  };
  var direct = (ref2, value, name) => ref2[name] = value;
  var dot = (element, value, name) => direct(element, value, name.slice(1));
  var maybeDirect = (element, value, name) => value == null ? (removeAttribute(element, name), value) : direct(element, value, name);
  var ref = (element, value) => (typeof value === "function" ? value(element) : value.current = element, value);
  var regular = (element, value, name) => (value == null ? removeAttribute(element, name) : setAttribute(element, name, value), value);
  var style = (element, value) => value == null ? maybeDirect(element, value, "style") : direct(element.style, value, "cssText");
  var toggle = (element, value, name) => (element.toggleAttribute(name.slice(1), value), value);
  var array = (node, value, prev) => {
    const { length } = value;
    node.data = `[${length}]`;
    if (length)
      return esm_default(node.parentNode, prev, value, diffFragment, node);
    switch (prev.length) {
      case 1:
        prev[0].remove();
      case 0:
        break;
      default:
        range_default(
          diffFragment(prev[0], 0),
          diffFragment(prev.at(-1), -0),
          false
        );
        break;
    }
    return empty;
  };
  var attr = /* @__PURE__ */ new Map([
    ["aria", aria],
    ["class", className],
    ["data", data],
    ["ref", ref],
    ["style", style]
  ]);
  var attribute = (element, name, svg3) => {
    var _a;
    switch (name[0]) {
      case ".":
        return dot;
      case "?":
        return toggle;
      case "@":
        return at;
      default:
        return svg3 || "ownerSVGElement" in element ? name === "ref" ? ref : regular : attr.get(name) || (name in element ? name.startsWith("on") ? direct : ((_a = gPD(element, name)) == null ? void 0 : _a.set) ? maybeDirect : regular : regular);
    }
  };
  var text = (element, value) => (element.textContent = value == null ? "" : value, value);

  // node_modules/uhtml/esm/literals.js
  var abc = (a2, b2, c2) => ({ a: a2, b: b2, c: c2 });
  var bc = (b2, c2) => ({ b: b2, c: c2 });
  var detail = (u2, t2, n, c2) => ({ v: empty, u: u2, t: t2, n, c: c2 });
  var cache = () => abc(null, null, empty);

  // node_modules/uhtml/esm/creator.js
  var creator_default = (parse) => (
    /**
     * @param {TemplateStringsArray} template
     * @param {any[]} values
     * @returns {import("./literals.js").Cache}
     */
    (template2, values) => {
      const { a: fragment, b: entries, c: direct2 } = parse(template2, values);
      const root = document.importNode(fragment, true);
      let details = empty;
      if (entries !== empty) {
        details = [];
        for (let current, prev, i2 = 0; i2 < entries.length; i2++) {
          const { a: path, b: update, c: name } = entries[i2];
          const node = path === prev ? current : current = find(root, prev = path);
          details[i2] = detail(
            update,
            node,
            name,
            update === array ? [] : update === hole ? cache() : null
          );
        }
      }
      return bc(
        direct2 ? root.firstChild : new PersistentFragment(root),
        details
      );
    }
  );

  // node_modules/domconstants/esm/re.js
  var TEXT_ELEMENTS = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
  var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

  // node_modules/@webreflection/uparser/esm/index.js
  var elements = /<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g;
  var attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
  var holes = /[\x01\x02]/g;
  var esm_default2 = (template2, prefix2, xml) => {
    let i2 = 0;
    return template2.join("").trim().replace(
      elements,
      (_2, name, attrs, selfClosing) => `<${name}${attrs.replace(attributes, "=$2$1").trimEnd()}${selfClosing ? xml || VOID_ELEMENTS.test(name) ? " /" : `></${name}` : ""}>`
    ).replace(
      holes,
      (hole2) => hole2 === "" ? `<!--${prefix2 + i2++}-->` : prefix2 + i2++
    );
  };

  // node_modules/uhtml/esm/create-content.js
  var template = document.createElement("template");
  var svg;
  var range2;
  var create_content_default = (text2, xml) => {
    if (xml) {
      if (!svg) {
        svg = document.createElementNS(SVG_NAMESPACE, "svg");
        range2 = newRange();
        range2.selectNodeContents(svg);
      }
      return range2.createContextualFragment(text2);
    }
    template.innerHTML = text2;
    const { content } = template;
    template = template.cloneNode(false);
    return content;
  };

  // node_modules/uhtml/esm/parser.js
  var createPath = (node) => {
    const path = [];
    let parentNode;
    while (parentNode = node.parentNode) {
      path.push(path.indexOf.call(parentNode.childNodes, node));
      node = parentNode;
    }
    return path;
  };
  var textNode = () => document.createTextNode("");
  var resolve = (template2, values, xml) => {
    const content = create_content_default(esm_default2(template2, prefix, xml), xml);
    const { length } = template2;
    let entries = empty;
    if (length > 1) {
      const replace = [];
      const tw = document.createTreeWalker(content, 1 | 128);
      let i2 = 0, search = `${prefix}${i2++}`;
      entries = [];
      while (i2 < length) {
        const node = tw.nextNode();
        if (node.nodeType === COMMENT_NODE) {
          if (node.data === search) {
            const update = isArray(values[i2 - 1]) ? array : hole;
            if (update === hole)
              replace.push(node);
            entries.push(abc(createPath(node), update, null));
            search = `${prefix}${i2++}`;
          }
        } else {
          let path;
          while (node.hasAttribute(search)) {
            if (!path)
              path = createPath(node);
            const name = node.getAttribute(search);
            entries.push(abc(path, attribute(node, name, xml), name));
            removeAttribute(node, search);
            search = `${prefix}${i2++}`;
          }
          if (!xml && TEXT_ELEMENTS.test(node.localName) && node.textContent.trim() === `<!--${search}-->`) {
            entries.push(abc(path || createPath(node), text, null));
            search = `${prefix}${i2++}`;
          }
        }
      }
      for (i2 = 0; i2 < replace.length; i2++)
        replace[i2].replaceWith(textNode());
    }
    const { childNodes } = content;
    let { length: len } = childNodes;
    if (len < 1) {
      len = 1;
      content.appendChild(textNode());
    } else if (len === 1 && // ignore html`static` or svg`static` because
    // these nodes can be passed directly as never mutated
    length !== 1 && childNodes[0].nodeType !== ELEMENT_NODE) {
      len = 0;
    }
    return set(cache2, template2, abc(content, entries, len === 1));
  };
  var cache2 = /* @__PURE__ */ new WeakMap();
  var prefix = "is\xB5";
  var parser_default = (xml) => (template2, values) => cache2.get(template2) || resolve(template2, values, xml);

  // node_modules/uhtml/esm/rabbit.js
  var createHTML = creator_default(parser_default(false));
  var createSVG = creator_default(parser_default(true));
  var unroll = (info, { s: s2, t: t2, v: v2 }) => {
    if (info.a !== t2) {
      const { b: b2, c: c2 } = (s2 ? createSVG : createHTML)(t2, v2);
      info.a = t2;
      info.b = b2;
      info.c = c2;
    }
    for (let { c: c2 } = info, i2 = 0; i2 < c2.length; i2++) {
      const value = v2[i2];
      const detail2 = c2[i2];
      switch (detail2.u) {
        case array:
          detail2.v = array(
            detail2.t,
            unrollValues(detail2.c, value),
            detail2.v
          );
          break;
        case hole:
          const current = value instanceof Hole ? unroll(detail2.c || (detail2.c = cache()), value) : (detail2.c = null, value);
          if (current !== detail2.v)
            detail2.v = hole(detail2, current);
          break;
        default:
          if (value !== detail2.v)
            detail2.v = detail2.u(detail2.t, value, detail2.n, detail2.v);
          break;
      }
    }
    return info.b;
  };
  var unrollValues = (stack, values) => {
    let i2 = 0, { length } = values;
    if (length < stack.length)
      stack.splice(length);
    for (; i2 < length; i2++) {
      const value = values[i2];
      if (value instanceof Hole)
        values[i2] = unroll(stack[i2] || (stack[i2] = cache()), value);
      else
        stack[i2] = null;
    }
    return values;
  };
  var Hole = class {
    constructor(svg3, template2, values) {
      this.s = svg3;
      this.t = template2;
      this.v = values;
    }
    toDOM(info = cache()) {
      return unroll(info, this);
    }
  };

  // node_modules/uhtml/esm/index.js
  var tag = (svg3) => (template2, ...values) => new Hole(svg3, template2, values);
  var html = tag(false);
  var svg2 = tag(true);

  // node_modules/uhtml/esm/render/shared.js
  var known = /* @__PURE__ */ new WeakMap();
  var shared_default = (where, what, check) => {
    const info = known.get(where) || set(known, where, cache());
    const { b: b2 } = info;
    const hole2 = check && typeof what === "function" ? what() : what;
    const node = hole2 instanceof Hole ? hole2.toDOM(info) : hole2;
    if (b2 !== node)
      where.replaceChildren((info.b = node).valueOf());
    return where;
  };

  // node_modules/uhtml/esm/keyed.js
  var keyed = /* @__PURE__ */ new WeakMap();
  var createRef = (svg3) => (
    /** @type {Bound} */
    (ref2, key) => {
      function tag2(template2, ...values) {
        return new Hole(svg3, template2, values).toDOM(this);
      }
      const memo = keyed.get(ref2) || set(keyed, ref2, /* @__PURE__ */ new Map());
      return memo.get(key) || set(memo, key, tag2.bind(cache()));
    }
  );
  var htmlFor = createRef(false);
  var svgFor = createRef(true);

  // node_modules/gc-hook/esm/index.js
  var registry = new FinalizationRegistry(
    ([onGarbageCollected, held, debug]) => {
      if (debug)
        console.debug(`%c${String(held)}`, "font-weight:bold", "collected");
      onGarbageCollected(held);
    }
  );
  var nullHandler = /* @__PURE__ */ Object.create(null);
  var create = (hold, onGarbageCollected, { debug, handler, return: r, token = hold } = nullHandler) => {
    const target = r || new Proxy(hold, handler || nullHandler);
    const args = [target, [onGarbageCollected, hold, !!debug]];
    if (token !== false)
      args.push(token);
    registry.register(...args);
    return target;
  };
  var drop = (token) => registry.unregister(token);

  // node_modules/uhtml/esm/render/reactive.js
  var effects = /* @__PURE__ */ new WeakMap();
  var onGC = (dispose) => dispose();
  var remove2 = true;
  var attach = (effect) => {
    return (where, what) => {
      remove2 = typeof what !== "function";
      detach(where);
      if (remove2)
        return shared_default(where, what, false);
      remove2 = true;
      const wr = new WeakRef(where);
      const dispose = effect(() => {
        shared_default(wr.deref(), what(), false);
      });
      effects.set(where, dispose);
      return create(dispose, onGC, { return: where });
    };
  };
  var detach = (where) => {
    const dispose = effects.get(where);
    if (dispose) {
      if (remove2)
        effects.delete(where);
      drop(dispose);
      dispose();
    }
  };

  // node_modules/@preact/signals-core/dist/signals-core.module.js
  var i = Symbol.for("preact-signals");
  function t() {
    if (!(s > 1)) {
      var i2, t2 = false;
      while (void 0 !== h) {
        var r = h;
        h = void 0;
        f++;
        while (void 0 !== r) {
          var o2 = r.o;
          r.o = void 0;
          r.f &= -3;
          if (!(8 & r.f) && c(r))
            try {
              r.c();
            } catch (r2) {
              if (!t2) {
                i2 = r2;
                t2 = true;
              }
            }
          r = o2;
        }
      }
      f = 0;
      s--;
      if (t2)
        throw i2;
    } else
      s--;
  }
  var o = void 0;
  var h = void 0;
  var s = 0;
  var f = 0;
  var v = 0;
  function e(i2) {
    if (void 0 !== o) {
      var t2 = i2.n;
      if (void 0 === t2 || t2.t !== o) {
        t2 = { i: 0, S: i2, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t2 };
        if (void 0 !== o.s)
          o.s.n = t2;
        o.s = t2;
        i2.n = t2;
        if (32 & o.f)
          i2.S(t2);
        return t2;
      } else if (-1 === t2.i) {
        t2.i = 0;
        if (void 0 !== t2.n) {
          t2.n.p = t2.p;
          if (void 0 !== t2.p)
            t2.p.n = t2.n;
          t2.p = o.s;
          t2.n = void 0;
          o.s.n = t2;
          o.s = t2;
        }
        return t2;
      }
    }
  }
  function u(i2) {
    this.v = i2;
    this.i = 0;
    this.n = void 0;
    this.t = void 0;
  }
  u.prototype.brand = i;
  u.prototype.h = function() {
    return true;
  };
  u.prototype.S = function(i2) {
    if (this.t !== i2 && void 0 === i2.e) {
      i2.x = this.t;
      if (void 0 !== this.t)
        this.t.e = i2;
      this.t = i2;
    }
  };
  u.prototype.U = function(i2) {
    if (void 0 !== this.t) {
      var t2 = i2.e, r = i2.x;
      if (void 0 !== t2) {
        t2.x = r;
        i2.e = void 0;
      }
      if (void 0 !== r) {
        r.e = t2;
        i2.x = void 0;
      }
      if (i2 === this.t)
        this.t = r;
    }
  };
  u.prototype.subscribe = function(i2) {
    var t2 = this;
    return E(function() {
      var r = t2.value, n = o;
      o = void 0;
      try {
        i2(r);
      } finally {
        o = n;
      }
    });
  };
  u.prototype.valueOf = function() {
    return this.value;
  };
  u.prototype.toString = function() {
    return this.value + "";
  };
  u.prototype.toJSON = function() {
    return this.value;
  };
  u.prototype.peek = function() {
    var i2 = o;
    o = void 0;
    try {
      return this.value;
    } finally {
      o = i2;
    }
  };
  Object.defineProperty(u.prototype, "value", { get: function() {
    var i2 = e(this);
    if (void 0 !== i2)
      i2.i = this.i;
    return this.v;
  }, set: function(i2) {
    if (i2 !== this.v) {
      if (f > 100)
        throw new Error("Cycle detected");
      this.v = i2;
      this.i++;
      v++;
      s++;
      try {
        for (var r = this.t; void 0 !== r; r = r.x)
          r.t.N();
      } finally {
        t();
      }
    }
  } });
  function d(i2) {
    return new u(i2);
  }
  function c(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n)
      if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i)
        return true;
    return false;
  }
  function a(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
      var r = t2.S.n;
      if (void 0 !== r)
        t2.r = r;
      t2.S.n = t2;
      t2.i = -1;
      if (void 0 === t2.n) {
        i2.s = t2;
        break;
      }
    }
  }
  function l(i2) {
    var t2 = i2.s, r = void 0;
    while (void 0 !== t2) {
      var o2 = t2.p;
      if (-1 === t2.i) {
        t2.S.U(t2);
        if (void 0 !== o2)
          o2.n = t2.n;
        if (void 0 !== t2.n)
          t2.n.p = o2;
      } else
        r = t2;
      t2.S.n = t2.r;
      if (void 0 !== t2.r)
        t2.r = void 0;
      t2 = o2;
    }
    i2.s = r;
  }
  function y(i2) {
    u.call(this, void 0);
    this.x = i2;
    this.s = void 0;
    this.g = v - 1;
    this.f = 4;
  }
  (y.prototype = new u()).h = function() {
    this.f &= -3;
    if (1 & this.f)
      return false;
    if (32 == (36 & this.f))
      return true;
    this.f &= -5;
    if (this.g === v)
      return true;
    this.g = v;
    this.f |= 1;
    if (this.i > 0 && !c(this)) {
      this.f &= -2;
      return true;
    }
    var i2 = o;
    try {
      a(this);
      o = this;
      var t2 = this.x();
      if (16 & this.f || this.v !== t2 || 0 === this.i) {
        this.v = t2;
        this.f &= -17;
        this.i++;
      }
    } catch (i3) {
      this.v = i3;
      this.f |= 16;
      this.i++;
    }
    o = i2;
    l(this);
    this.f &= -2;
    return true;
  };
  y.prototype.S = function(i2) {
    if (void 0 === this.t) {
      this.f |= 36;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n)
        t2.S.S(t2);
    }
    u.prototype.S.call(this, i2);
  };
  y.prototype.U = function(i2) {
    if (void 0 !== this.t) {
      u.prototype.U.call(this, i2);
      if (void 0 === this.t) {
        this.f &= -33;
        for (var t2 = this.s; void 0 !== t2; t2 = t2.n)
          t2.S.U(t2);
      }
    }
  };
  y.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 6;
      for (var i2 = this.t; void 0 !== i2; i2 = i2.x)
        i2.t.N();
    }
  };
  Object.defineProperty(y.prototype, "value", { get: function() {
    if (1 & this.f)
      throw new Error("Cycle detected");
    var i2 = e(this);
    this.h();
    if (void 0 !== i2)
      i2.i = this.i;
    if (16 & this.f)
      throw this.v;
    return this.v;
  } });
  function w(i2) {
    return new y(i2);
  }
  function _(i2) {
    var r = i2.u;
    i2.u = void 0;
    if ("function" == typeof r) {
      s++;
      var n = o;
      o = void 0;
      try {
        r();
      } catch (t2) {
        i2.f &= -2;
        i2.f |= 8;
        g(i2);
        throw t2;
      } finally {
        o = n;
        t();
      }
    }
  }
  function g(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n)
      t2.S.U(t2);
    i2.x = void 0;
    i2.s = void 0;
    _(i2);
  }
  function p(i2) {
    if (o !== this)
      throw new Error("Out-of-order effect");
    l(this);
    o = i2;
    this.f &= -2;
    if (8 & this.f)
      g(this);
    t();
  }
  function b(i2) {
    this.x = i2;
    this.u = void 0;
    this.s = void 0;
    this.o = void 0;
    this.f = 32;
  }
  b.prototype.c = function() {
    var i2 = this.S();
    try {
      if (8 & this.f)
        return;
      if (void 0 === this.x)
        return;
      var t2 = this.x();
      if ("function" == typeof t2)
        this.u = t2;
    } finally {
      i2();
    }
  };
  b.prototype.S = function() {
    if (1 & this.f)
      throw new Error("Cycle detected");
    this.f |= 1;
    this.f &= -9;
    _(this);
    a(this);
    s++;
    var i2 = o;
    o = this;
    return p.bind(this, i2);
  };
  b.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 2;
      this.o = h;
      h = this;
    }
  };
  b.prototype.d = function() {
    this.f |= 8;
    if (!(1 & this.f))
      g(this);
  };
  function E(i2) {
    var t2 = new b(i2);
    try {
      t2.c();
    } catch (i3) {
      t2.d();
      throw i3;
    }
    return t2.d.bind(t2);
  }

  // packages/core/src/app.ts
  var createServiceLocator = () => {
    const services = {};
    const register = (name, factory) => {
      services[name] = { factory };
    };
    const get = (name, ...args) => {
      const service = services[name];
      if (!service) {
        throw new Error(`Service ${name} not found`);
      }
      if (!service.instance) {
        service.instance = service.factory(...args);
      }
      return service.instance;
    };
    const clear = () => {
      Object.keys(services).forEach((key) => {
        delete services[key];
      });
    };
    return { register, get, clear };
  };
  var app = {
    ...createServiceLocator()
  };

  // packages/core/src/component.ts
  function def(options) {
    const {
      tagName,
      props: propsDefinition = {},
      slots: slotsDefinition,
      setup,
      connected,
      disconnected,
      render
    } = options;
    const uRender = attach(E);
    class BaseComponent extends HTMLElement {
      $(key) {
        return this[key];
      }
      emitEvent(name, detail2) {
        this.dispatchEvent(new CustomEvent(name, { detail: detail2 }));
      }
    }
    class Component extends BaseComponent {
      constructor() {
        super();
        this.cleanup = [];
        this.propsSignals = this.initializeProps();
        Object.keys(this.propsSignals).forEach((key) => {
          this[key] = this.propsSignals[key];
        });
        this.setupResult = (setup == null ? void 0 : setup({
          props: this.propsSignals,
          app
        })) || {};
        Object.entries(this.setupResult).forEach(([key, value]) => {
          if (typeof value === "function") {
            this[key] = value.bind(this);
          } else {
            this[key] = value;
          }
        });
      }
      static get observedAttributes() {
        return Object.keys(propsDefinition).map((name) => `data-${name}`);
      }
      initializeProps() {
        var _a;
        const signals = {};
        for (const [key, definition] of Object.entries(propsDefinition)) {
          const attrName = `data-${key}`;
          const attrValue = this.getAttribute(attrName);
          const defaultValue = (_a = definition.default) != null ? _a : this.getDefaultForType(definition.type);
          const initialValue = attrValue !== null ? this.parseAttributeValue(attrValue, definition.type) : defaultValue;
          signals[key] = d(initialValue);
        }
        return signals;
      }
      getDefaultForType(type) {
        switch (type) {
          case String:
            return "";
          case Number:
            return 0;
          case Boolean:
            return false;
          case Object:
            return {};
          case Array:
            return [];
          default:
            return null;
        }
      }
      parseAttributeValue(value, type) {
        switch (type) {
          case Number:
            return Number(value);
          case Boolean:
            return value !== null && value !== "false";
          case Object:
          case Array:
            try {
              return JSON.parse(value);
            } catch {
              return type === Object ? {} : [];
            }
          default:
            return value;
        }
      }
      attributeChangedCallback(name, oldValue, newValue) {
        const propName = name.replace(/^data-/, "");
        const propDef = propsDefinition[propName];
        if (!propDef)
          return;
        const value = this.parseAttributeValue(newValue, propDef.type);
        this.propsSignals[propName].value = value;
      }
      setupRender() {
        if (!render)
          return;
        const cleanup = uRender(this, () => {
          return render.call(this);
        });
        this.cleanup.push(cleanup);
      }
      connectedCallback() {
        requestAnimationFrame(() => {
          this.collectSlots();
          this.setupRender();
          if (connected) {
            connected.call(this);
          }
        });
      }
      disconnectedCallback() {
        this.cleanup.forEach((cleanup) => cleanup());
        this.cleanup = [];
        if (disconnected) {
          disconnected.call(this);
        }
      }
      collectSlots() {
        const slots = { default: [] };
        if (slotsDefinition) {
          slotsDefinition.forEach((slot) => {
            slots[slot] = [];
          });
        }
        Array.from(this.childNodes).forEach((node) => {
          var _a;
          if (node instanceof Element) {
            const slotName = node.getAttribute("data-slot") || "default";
            if (slotName !== "default" && slotsDefinition && !slotsDefinition.includes(slotName)) {
              console.warn(`Slot "${slotName}" is not defined in component slots`);
              return;
            }
            if (node.hasChildNodes()) {
              slots[slotName] = slots[slotName] || [];
              slots[slotName].push(...Array.from(node.childNodes));
            }
          } else if ((_a = node.textContent) == null ? void 0 : _a.trim()) {
            slots.default.push(node);
          }
        });
        this.slots = slots;
      }
    }
    if (tagName) {
      customElements.define(tagName, Component);
    }
  }

  // packages/core/src/state.ts
  var StateSignal = class extends u {
    emit(value) {
      if (typeof value === "object" && value !== null && typeof this.value === "object") {
        const currentClone = cloneDeep(this.value);
        this.value = { ...currentClone, ...value };
      } else {
        this.value = value;
      }
    }
  };
  function useState(initialValue) {
    const baseSignal = d(initialValue);
    Object.setPrototypeOf(baseSignal, StateSignal.prototype);
    return baseSignal;
  }
  function cloneDeep(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(cloneDeep);
    }
    const clonedObj = {};
    for (const key of Reflect.ownKeys(obj)) {
      clonedObj[key] = cloneDeep(obj[key]);
    }
    return clonedObj;
  }
  function computed(fn) {
    return w(fn);
  }
  return __toCommonJS(src_exports);
})();
/*! Bundled license information:

uhtml/esm/index.js:
  (*! (c) Andrea Giammarchi - MIT *)

uhtml/esm/keyed.js:
  (*! (c) Andrea Giammarchi - MIT *)
*/
