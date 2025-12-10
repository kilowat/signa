//component.js
import { reactive, html, htmlFor } from 'uhtml/reactive';
import { effect, signal, computed } from '@preact/signals-core';
import { createHooksContext, pushContext, popContext } from './hooks.js';
import { resolveStore } from './store.js';
import { componentStart, componentRendered, } from './lifecycle.js';
import { createRouter } from './router.js';
import { eventBus } from './eventBus.js';
import { inject, provide } from './registry.js';


function camelCaseToKebabCase(camelCaseString) {
    return camelCaseString
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();
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
                prop: ({ name, type, default: defaultValue }) => {
                    const val = this[name];

                    // Если тип указан как 'Signal'
                    if (type === 'Signal' || type === signal) {
                        if (val !== undefined) {
                            if (!isSignal(val)) {
                                throw new Error(`Property "${name}" must be a Signal, but received ${typeof val}`);
                            }
                            // Делаем Signal readonly
                            const readOnlySignal = {
                                get value() { return val.value; },
                                set value(v) { console.warn(`Property "${name}" is readonly`); },
                                peek: val.peek.bind(val)
                            };
                            this.props.set(name, readOnlySignal);
                            return readOnlySignal;
                        }
                        throw new Error(`Property "${name}" with type Signal is required but not provided`);
                    }

                    // Колбэки всегда возвращаем напрямую
                    if (type === Function && typeof val === 'function') {
                        this.props.set(name, val);
                        return val;
                    }

                    // Если передан Signal, но ожидается примитивный тип - берем value
                    if (isSignal(val) && (type === String || type === Number || type === Boolean || type === Object || type === Array)) {
                        const extractedValue = val.value;
                        this.props.set(name, extractedValue);
                        return extractedValue;
                    }

                    // Если передано обычное значение
                    if (val !== undefined) {
                        this.props.set(name, val);
                        return val;
                    }

                    // Чтение из атрибутов
                    const attrData = this.getAttribute(`data-${name}`);
                    const attrValue = attrData === null ? this.getAttribute(`data-${camelCaseToKebabCase(name)}`) : attrData;
                    const initialValue = attrValue !== null
                        ? this.parseAttributeValue(attrValue, type)
                        : (defaultValue !== undefined ? defaultValue : this.getDefaultForType(type));

                    this.props.set(name, initialValue);
                    return initialValue;
                },
                slot: slotFn,
                store: key => resolveStore(key),
                inject: inject,
                provide: provide,
                createRouter: createRouter,
                eventBus: eventBus,
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