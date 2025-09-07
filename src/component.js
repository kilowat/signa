import { reactive } from 'uhtml/reactive';
import { effect, signal, computed } from '@preact/signals-core';
import { html, htmlFor } from 'uhtml/reactive';
import { createHooksContext, pushContext, popContext } from './hooks.js';
import { resolveStore } from './store.js';

export function defComponent(tagName, setup) {
    const uRender = reactive(effect);

    class Component extends HTMLElement {
        static observedProps = new Set();

        static get observedAttributes() {
            return Array.from(this.observedProps).map(name => `data-${name}`);
        }

        constructor() {
            super();
            this.hooksContext = createHooksContext();
            this.cleanup = [];
            this.isMounted = false;
            this.slots = { default: [] };
            this.props = new Map();
        }

        $(key) {
            return this[key];
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
                prop: config => {
                    const { name, type, default: defaultValue } = config;
                    Component.observedProps.add(name);

                    const attrName = `data-${name}`;
                    const attrValue = this.getAttribute(attrName);

                    const initialValue = attrValue !== null
                        ? this.parseAttributeValue(attrValue, type)
                        : (defaultValue !== undefined ? defaultValue : this.getDefaultForType(type));

                    const propSignal = signal(initialValue);
                    this.props.set(name, propSignal);
                    return propSignal;
                },
                slot: slotFn,
                useStore: key => resolveStore(key)
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
                case Boolean: return value !== null && value !== 'false';
                case Object:
                case Array:
                    try {
                        return JSON.parse(value);
                    } catch {
                        return type === Object ? {} : [];
                    }
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

        attributeChangedCallback(name, oldValue, newValue) {
            const propName = name.replace(/^data-/, '');
            let propSignal = this.props.get(propName);

            if (!propSignal) {
                const type = String;
                propSignal = signal(this.parseAttributeValue(newValue, type));
                this.props.set(propName, propSignal);
                return;
            }

            const type = this.getTypeFromValue(propSignal.value);
            propSignal.value = this.parseAttributeValue(newValue, type);
        }

        getTypeFromValue(value) {
            if (value === null) return null;
            switch (typeof value) {
                case 'string': return String;
                case 'number': return Number;
                case 'boolean': return Boolean;
                case 'object': return Array.isArray(value) ? Array : Object;
                default: return String;
            }
        }

        connectedCallback() {
            this.isMounted = true;
            requestAnimationFrame(() => {
                if (!this.isMounted) return;

                try {
                    this.collectSlots();
                    pushContext(this.hooksContext, 'setup');
                    const renderFn = setup(this.createComponentContext());
                    const cleanup = uRender(this, renderFn);
                    if (typeof cleanup === 'function') {
                        this.cleanup.push(cleanup);
                    }
                    popContext();
                } catch (error) {
                    console.error(`Error mounting component ${this.tagName.toLowerCase()}:`, error);
                    this.handleMountError(error);
                }
            });
        }

        disconnectedCallback() {
            this.isMounted = false;
            this.cleanup.forEach(fn => {
                try { fn(); } catch { }
            });
            this.cleanup = [];
            this.hooksContext.cleanups.forEach(fn => {
                try { fn(); } catch { }
            });
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

    if (customElements.get(tagName)) {
        throw new Error(`Component "${tagName}" is already defined`);
    }

    customElements.define(tagName, Component);
}
