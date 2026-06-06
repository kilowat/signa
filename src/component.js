import { reactive, html } from 'uhtml/reactive';
import { effect, signal, computed } from '@preact/signals-core';
import { isSignal } from './state.js';
import { bus } from './bus.js';

function toKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function parseAttr(value, type) {
    if (value === null) return null;
    switch (type) {
        case Number: return Number(value);
        case Boolean: return value !== 'false';
        case Object:
        case Array:
            try { return JSON.parse(value); } catch { return type === Object ? {} : []; }
        default: return value;
    }
}

function defaultFor(type) {
    switch (type) {
        case String: return '';
        case Number: return 0;
        case Boolean: return false;
        case Object: return {};
        case Array: return [];
        default: return null;
    }
}

export function defComponent(tagName, setup) {
    const uRender = reactive(effect);

    class Component extends HTMLElement {
        #cleanups = [];
        #props = new Map();
        #rawProps = {};
        #slots = { default: [] };
        #mounted = false;

        #addEffect(fn) {
            const stop = effect(() => {
                const cleanup = fn();
                if (typeof cleanup === 'function') this.#cleanups.push(cleanup);
            });
            this.#cleanups.push(() => stop());
        }

        #resolveProp(name, type, defaultValue) {
            if (this.#props.has(name)) return this.#props.get(name);

            const raw = this[name];

            if (isSignal(raw)) {
                raw.__type = type ?? raw.__type ?? null;
                this.#props.set(name, raw);
                this.#rawProps[name] = raw;
                return raw;
            }

            if (typeof raw === 'function') {
                this.#props.set(name, raw);
                return raw;
            }

            const attrVal = this.getAttribute(`data-${name}`) ?? this.getAttribute(`data-${toKebab(name)}`);

            let finalType = type;
            if (!finalType) {
                if (raw !== undefined) finalType = raw.constructor;
                else if (attrVal !== null) {
                    if (!isNaN(Number(attrVal))) finalType = Number;
                    else if (attrVal === 'true' || attrVal === 'false') finalType = Boolean;
                    else if (attrVal.startsWith('{') || attrVal.startsWith('[')) finalType = Object;
                    else finalType = String;
                } else if (defaultValue !== undefined) finalType = defaultValue.constructor;
                else finalType = String;
            }

            const initial = raw !== undefined
                ? raw
                : attrVal !== null
                    ? parseAttr(attrVal, finalType)
                    : defaultValue !== undefined ? defaultValue : defaultFor(finalType);

            const s = signal(initial);
            s.__type = finalType;
            this.#rawProps[name] = s;

            const readonly = { get value() { return s.value; }, set value(_) { }, peek: s.peek.bind(s) };
            this.#props.set(name, readonly);
            return readonly;
        }

        #collectSlots() {
            const slots = { default: [] };
            for (const node of this.childNodes) {
                if (node instanceof Element) {
                    const name = node.getAttribute('data-slot');
                    if (name) { slots[name] ??= []; slots[name].push(...node.childNodes); }
                    else slots.default.push(node);
                } else {
                    slots.default.push(node);
                }
            }
            this.#slots = slots;
        }

        #ctx() {
            const slot = Object.assign(name => this.#slots[name] ?? [], { default: this.#slots.default });
            return {
                $this: this,
                signal,
                computed,
                effect: this.#addEffect.bind(this),
                html,
                prop: (name, type, def) => this.#resolveProp(name, type, def),
                slot,
                bus,
            };
        }

        connectedCallback() {
            this.#mounted = true;

            this._observer = new MutationObserver(muts => {
                for (const m of muts) {
                    if (m.type !== 'attributes' || !m.attributeName.startsWith('data-')) continue;
                    const propName = m.attributeName
                        .replace(/^data-/, '')
                        .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
                    const raw = this.#rawProps[propName];
                    if (raw && isSignal(raw)) {
                        raw.value = parseAttr(this.getAttribute(m.attributeName), raw.__type || String);
                    }
                }
            });
            this._observer.observe(this, { attributes: true });

            requestAnimationFrame(() => {
                if (!this.#mounted) return;
                try {
                    this.#collectSlots();
                    const renderFn = setup(this.#ctx());
                    if (typeof renderFn === 'function') {
                        const clean = uRender(this, renderFn);
                        if (typeof clean === 'function') this.#cleanups.push(clean);
                    }
                } catch (e) {
                    console.error(`[sig] error mounting <${tagName}>:`, e);
                }
            });
        }

        disconnectedCallback() {
            this.#mounted = false;
            this._observer?.disconnect();
            this.#cleanups.forEach(fn => { try { fn(); } catch { } });
            this.#cleanups = [];
        }
    }

    if (customElements.get(tagName)) throw new Error(`[sig] <${tagName}> is already defined`);
    customElements.define(tagName, Component);
}