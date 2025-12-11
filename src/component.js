//component.js
import { reactive, html, htmlFor, svg } from 'uhtml/reactive';
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
                svg,
                prop: (name, { type, default: defaultValue }) => {

                    // Если уже существует — вернуть
                    if (this.props.has(name)) return this.props.get(name);

                    const rawVal = this[name];

                    // 1. Передан сигнал → используем напрямую
                    if (isSignal(rawVal)) {
                        rawVal.__type = type;
                        this.props.set(name, rawVal);
                        return rawVal;
                    }

                    // 2. Передана функция → оставляем как есть
                    if (typeof rawVal === 'function') {
                        this.props.set(name, rawVal);
                        return rawVal;
                    }

                    // 3. Пытаемся получить из атрибута data-*
                    const attrData = this.getAttribute(`data-${name}`);
                    const attrValue = attrData === null
                        ? this.getAttribute(`data-${camelCaseToKebabCase(name)}`)
                        : attrData;

                    const initial = rawVal !== undefined
                        ? rawVal
                        : (attrValue !== null
                            ? this.parseAttributeValue(attrValue, type)
                            : (defaultValue !== undefined ? defaultValue : this.getDefaultForType(type)));

                    // 4. Создаем внутренний сигнал
                    const s = signal(initial);
                    s.__type = type;

                    // 5. Readonly wrapper
                    const readonly = {
                        get value() { return s.value; },
                        set value(_) {
                            console.warn(`Property "${name}" is readonly`);
                        },
                        peek: s.peek.bind(s)
                    };

                    this.props.set(name, readonly);

                    return readonly;
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
    }

    if (customElements.get(tagName)) throw new Error(`Component "${tagName}" is already defined`);
    customElements.define(tagName, Component);
}