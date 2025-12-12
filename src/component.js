// component.js
import { reactive, html, htmlFor, svg } from 'uhtml/reactive';
import { effect, signal, computed } from '@preact/signals-core';
import { createHooksContext, pushContext, popContext } from './hooks.js';
import { resolveStore } from './store.js';
import { componentStart, componentRendered } from './lifecycle.js';
import { createRouter } from './router.js';
import { eventBus } from './eventBus.js';
import { inject, provide } from './registry.js';

function camelCaseToKebabCase(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function isSignal(obj) {
    return obj && typeof obj === 'object' && typeof obj.peek === 'function' && 'value' in obj;
}

export function defComponent(tagName, setup) {
    const uRender = reactive(effect);

    class Component extends HTMLElement {
        constructor() {
            super();
            this.hooksContext = createHooksContext();
            this.cleanup = [];
            this.isMounted = false;
            this.slots = { default: [] };
            this.props = new Map();

            this._rawProps = {};
        }

        #addEffect(fn) {
            const stop = effect(() => {
                const cleanup = fn();
                if (typeof cleanup === 'function') {
                    this.hooksContext.cleanups.push(cleanup);
                }
            });
            this.hooksContext.cleanups.push(() => stop());
        }


        #resolveProp(name, config = {}) {
            const { type, default: defaultValue } = config;

            if (this.props.has(name)) return this.props.get(name);

            const rawVal = this[name];

            if (isSignal(rawVal)) {
                rawVal.__type = type ?? rawVal.__type ?? null;
                this.props.set(name, rawVal);
                this._rawProps[name] = rawVal;
                return rawVal;
            }

            if (typeof rawVal === 'function') {
                this.props.set(name, rawVal);
                return rawVal;
            }

            const attrData = this.getAttribute(`data-${name}`);
            const kebab = camelCaseToKebabCase(name);
            const attrValue = attrData ?? this.getAttribute(`data-${kebab}`);

            let finalType = type;

            if (!finalType) {
                if (rawVal !== undefined) finalType = rawVal.constructor;
                else if (attrValue !== null) {
                    if (!isNaN(Number(attrValue))) finalType = Number;
                    else if (attrValue === 'true' || attrValue === 'false') finalType = Boolean;
                    else if (attrValue.startsWith('{') || attrValue.startsWith('[')) finalType = Object;
                    else finalType = String;
                } else if (defaultValue !== undefined) {
                    finalType = defaultValue.constructor;
                } else {
                    finalType = String;
                }
            }

            const initial =
                rawVal !== undefined
                    ? rawVal
                    : (attrValue !== null
                        ? this.#parseAttributeValue(attrValue, finalType)
                        : (defaultValue !== undefined
                            ? defaultValue
                            : this.#getDefaultForType(finalType)));

            const s = signal(initial);
            s.__type = finalType;
            this._rawProps[name] = s;

            const readonly = {
                get value() { return s.value; },
                set value(_) { },
                peek: s.peek.bind(s)
            };

            this.props.set(name, readonly);
            return readonly;
        }

        #getDefaultForType(type) {
            switch (type) {
                case String: return '';
                case Number: return 0;
                case Boolean: return false;
                case Object: return {};
                case Array: return [];
                default: return null;
            }
        }

        #parseAttributeValue(value, type) {
            if (value === null) return null;
            switch (type) {
                case Number: return Number(value);
                case Boolean: return value !== 'false';
                case Object:
                case Array:
                    try { return JSON.parse(value); }
                    catch { return type === Object ? {} : []; }
                default:
                    return value;
            }
        }

        #updatePropFromAttribute(attrName, value) {
            const propName = attrName
                .replace(/^data-/, '')
                .replace(/-([a-z])/g, (_, c) => c.toUpperCase());

            const raw = this._rawProps[propName];
            if (!raw || !isSignal(raw)) return;

            const type = raw.__type || String;
            const parsed = this.#parseAttributeValue(value, type);

            raw.value = parsed;
        }

        #collectSlots() {
            const slots = { default: [] };

            Array.from(this.childNodes).forEach(node => {
                if (node instanceof Element) {
                    const slotName = node.getAttribute('data-slot');
                    if (slotName) {
                        slots[slotName] ??= [];
                        slots[slotName].push(...Array.from(node.childNodes));
                    } else {
                        slots.default.push(node);
                    }
                } else {
                    slots.default.push(node);
                }
            });

            this.slots = slots;
        }

        #createComponentContext() {
            const slotFn = Object.assign(
                name => this.slots[name] || [],
                { default: this.slots.default }
            );

            return {
                $this: this,
                signal,
                effect: this.#addEffect.bind(this),
                computed,
                html,
                htmlFor,
                svg,
                prop: this.#resolveProp.bind(this),
                slot: slotFn,
                store: key => resolveStore(key),
                inject,
                provide,
                createRouter,
                eventBus,
            };
        }

        connectedCallback() {
            this.isMounted = true;
            componentStart();

            this._attrObserver = new MutationObserver(muts => {
                for (const m of muts) {
                    if (m.type === 'attributes' && m.attributeName.startsWith('data-')) {
                        const newValue = this.getAttribute(m.attributeName);
                        this.#updatePropFromAttribute(m.attributeName, newValue);
                    }
                }
            });

            this._attrObserver.observe(this, { attributes: true });

            requestAnimationFrame(() => {
                if (!this.isMounted) return;

                try {
                    this.#collectSlots();

                    pushContext(this.hooksContext, 'setup');
                    const renderFn = setup(this.#createComponentContext());

                    if (renderFn !== undefined) {
                        const clean = uRender(this, renderFn);
                        if (typeof clean === 'function') this.cleanup.push(clean);
                    }

                    popContext();
                    queueMicrotask(() => componentRendered());
                } catch (e) {
                    console.error(`Error mounting component ${this.tagName.toLowerCase()}:`, e);
                    componentRendered();
                }
            });
        }

        disconnectedCallback() {
            this.isMounted = false;

            if (this._attrObserver) this._attrObserver.disconnect();

            this.cleanup.forEach(fn => { try { fn(); } catch { } });
            this.cleanup = [];

            this.hooksContext.cleanups.forEach(fn => { try { fn(); } catch { } });
            this.hooksContext.cleanups = [];
        }
    }

    if (customElements.get(tagName))
        throw new Error(`Component "${tagName}" is already defined`);

    customElements.define(tagName, Component);
}
