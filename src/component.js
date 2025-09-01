import { reactive } from 'uhtml/reactive';
import { effect, signal, computed } from '@preact/signals-core';
import { html, htmlFor } from 'uhtml/reactive';
import { createHooksContext, pushContext, popContext } from './hooks.js';
import { resolveStore } from './store.js';

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
            this.observedProps = new Set();
        }

        static get observedAttributes() {
            return Array.from(this.prototype.observedProps || []).map(name => `data-${name}`);
        }

        $(key) {
            return this[key];
        }

        emitEvent(name, detail) {
            this.dispatchEvent(new CustomEvent(name, { detail }));
        }

        createComponentContext() {
            const slotFn = Object.assign(
                name => this.slots[name] || [],
                { default: this.slots.default }
            );

            return {
                signal,
                effect,
                computed,
                html,
                htmlFor,
                prop: config => {
                    const { name, type, default: defaultValue } = config;
                    this.observedProps.add(name);

                    const attrName = `data-${name}`;
                    const attrValue = this.getAttribute(attrName);
                    const initialValue = attrValue !== null
                        ? this.parseAttributeValue(attrValue, type)
                        : (defaultValue ?? this.getDefaultForType(type));

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
                        Array.from(node.childNodes).forEach(child => {
                            slots[slotName].push(child);
                        });
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
            const propSignal = this.props.get(propName);
            if (propSignal) {
                const type = this.getTypeFromValue(propSignal.value);
                propSignal.value = this.parseAttributeValue(newValue, type);
            }
        }

        getTypeFromValue(value) {
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
                    this.cleanup.push(cleanup);
                    popContext();
                } catch (error) {
                    console.error(`Error mounting component ${this.tagName.toLowerCase()}:`, error);
                    this.handleMountError(error);
                }
            });
        }

        disconnectedCallback() {
            this.isMounted = false;
            this.cleanup.forEach(fn => fn());
            this.cleanup = [];
            this.hooksContext.cleanups.forEach(fn => fn());
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

    if (!customElements.get(tagName)) {
        customElements.define(tagName, Component);
    }
}
