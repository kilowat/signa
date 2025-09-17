import { reactive, html, htmlFor } from 'uhtml/reactive';
import { effect, signal, computed } from '@preact/signals-core';
import { createHooksContext, pushContext, popContext } from './hooks.js';
import { resolveStore } from './store.js';
import { componentStart, componentRendered } from './lifecycle.js';

let activeComponents = 0;
let scheduledCheck = null;

function notifyIfAllReady() {
    if (scheduledCheck) clearTimeout(scheduledCheck);
    scheduledCheck = setTimeout(() => {
        if (activeComponents > 0) {
            document.dispatchEvent(new CustomEvent("signa:ready"));
        }
    });
}

function camelCaseToKebabCase(camelCaseString) {
    return camelCaseString
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();
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
        }

        createComponentContext() {
            const slotFn = Object.assign(
                name => this.slots[name] || [],
                { default: this.slots.default }
            );

            return {
                $this: this,
                signal,
                effect: fn => {
                    const stop = effect(() => {
                        const cleanup = fn();
                        if (typeof cleanup === 'function') {
                            this.hooksContext.cleanups.push(cleanup);
                        }
                    });
                    this.hooksContext.cleanups.push(() => stop());
                },
                computed,
                html,
                htmlFor,
                prop: ({ name, type, default: defaultValue, readonly = true }) => {
                    const val = this[name];

                    //Колбэки всегда возвращаем напрямую
                    if (type === Function && typeof val === 'function') {
                        this.props.set(name, val);
                        return val;
                    }

                    if (val && typeof val.peek === 'function') {
                        // если readonly, оборачиваем сигнал в прокси только для чтения
                        if (readonly) {
                            const readOnlySignal = {
                                get value() { return val.value; },
                                set value(value) { console.warn('prop ' + name + ' is readonly'); },
                                peek: val.peek.bind(val)
                            };
                            this.props.set(name, readOnlySignal);
                            return readOnlySignal;
                        }
                        this.props.set(name, val);
                        return val;
                    }

                    if (val !== undefined) {
                        const sig = signal(val);
                        this.props.set(name, sig);
                        return sig;
                    }

                    const attrData = this.getAttribute(`data-${name}`);
                    const attrValue = attrData === null ? this.getAttribute(`data-${camelCaseToKebabCase(name)}`) : attrData;
                    const initialValue = attrValue !== null
                        ? this.parseAttributeValue(attrValue, type)
                        : (defaultValue !== undefined ? defaultValue : this.getDefaultForType(type));

                    const sig = signal(initialValue);
                    this.props.set(name, sig);
                    return sig;
                },
                slot: slotFn,
                store: key => resolveStore(key),
            };
        }

        getDefaultForType(type) {
            switch (type) {
                case String: return '';
                case Number: return 0;
                case Boolean: return false;
                case Object: return {};
                case Array: return [];
                default: return null;
            }
        }

        parseAttributeValue(value, type) {
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

        collectSlots() {
            const slots = { default: [] };
            Array.from(this.childNodes).forEach(node => {
                if (node instanceof Element) {
                    const slotName = node.getAttribute('data-slot');
                    if (slotName) {
                        slots[slotName] = slots[slotName] || [];
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

        connectedCallback() {
            this.isMounted = true;
            componentStart();

            requestAnimationFrame(() => {
                if (!this.isMounted) return;
                try {
                    this.collectSlots();

                    pushContext(this.hooksContext, 'setup');
                    const renderFn = setup(this.createComponentContext());
                    if (renderFn !== undefined) {
                        const cleanup = uRender(this, renderFn);
                        if (typeof cleanup === 'function') this.cleanup.push(cleanup);
                    }
                    popContext();
                    queueMicrotask(() => componentRendered());
                } catch (error) {
                    console.error(`Error mounting component ${this.tagName.toLowerCase()}:`, error);
                    this.handleMountError(error);
                    componentRendered();
                }
            });
        }


        disconnectedCallback() {
            this.isMounted = false;
            this.cleanup.forEach(fn => { try { fn(); } catch { } });
            this.cleanup = [];
            this.hooksContext.cleanups.forEach(fn => { try { fn(); } catch { } });
            this.hooksContext.cleanups = [];
        }

        handleMountError(error) {
            const errorContainer = document.createElement('div');
            errorContainer.style.cssText = 'padding: 1rem; border: 1px solid #ff0000; border-radius: 4px; margin: 0.5rem; color: #ff0000;';
            errorContainer.innerHTML = `
                <div>Error in component ${this.tagName.toLowerCase()}</div>
                <pre style="font-size: 0.8em; margin-top: 0.5rem;">${error instanceof Error ? error.message : 'Unknown error'}</pre>
            `;
            this.innerHTML = '';
            this.appendChild(errorContainer);
        }
    }

    if (customElements.get(tagName)) throw new Error(`Component "${tagName}" is already defined`);
    customElements.define(tagName, Component);
}
