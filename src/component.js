import { reactive, html } from 'uhtml/reactive';

import {
    effect as rawEffect,
    signal,
    computed,
} from '@preact/signals-core';

import {
    isSignal,
    createStateAccess,
} from './state.js';

import {
    createScope,
    withScope,
    effectInScope,
    addCleanup,
    disposeScope,
} from './scope.js';

import { bus } from './bus.js';


function toKebab(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}


function toCamel(str) {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}


function parseAttr(value, type) {
    if (value === null) {
        return null;
    }

    switch (type) {
        case Number: {
            const n = Number(value);

            if (Number.isNaN(n)) {
                console.warn(`[$$] cannot parse "${value}" as Number`);
                return defaultFor(Number);
            }

            return n;
        }

        case Boolean:
            // "" (голый атрибут) и любое значение, кроме "false" -> true
            return value !== 'false';

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


function defaultFor(type) {
    switch (type) {
        case String:
            return '';

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


function detectType(raw, attrVal, defaultValue) {
    if (raw != null) {
        return raw.constructor;
    }

    if (attrVal !== null) {
        const trimmed = attrVal.trim();

        if (trimmed !== '' && !isNaN(Number(trimmed))) {
            return Number;
        }

        if (trimmed === 'true' || trimmed === 'false') {
            return Boolean;
        }

        if (trimmed.startsWith('{')) {
            return Object;
        }

        if (trimmed.startsWith('[')) {
            return Array;
        }

        return String;
    }

    if (defaultValue != null) {
        return defaultValue.constructor;
    }

    return String;
}


export function defComponent(tagName, setup) {
    if (customElements.get(tagName)) {
        throw new Error(
            `[$$] <${tagName}> is already defined`
        );
    }

    const uRender = reactive(rawEffect);

    class Component extends HTMLElement {
        // name -> readonly-обёртка или внешний сигнал/функция
        #props = new Map();

        // name -> { s, type }: только сигналы, которыми владеет компонент.
        // Внешние сигналы сюда НЕ попадают, атрибуты их не перезаписывают.
        #owned = new Map();

        // имя атрибута (в нижнем регистре) -> имя пропса
        #attrToProp = new Map();

        #slots = { default: [] };
        #slotsCollected = false;
        #mounted = false;
        #scope = null;
        #observer = null;

        #resolveProp(name, type, defaultValue) {
            // нормализуем: prop('user-name') и prop('userName') — один и тот же пропс
            const key = toCamel(name);

            if (this.#props.has(key)) {
                return this.#props.get(key);
            }

            const raw = this[key];

            if (isSignal(raw) || typeof raw === 'function') {
                this.#props.set(key, raw);
                return raw;
            }

            const kebab = toKebab(key);
            const attrVal =
                this.getAttribute(`data-${kebab}`) ??
                this.getAttribute(`data-${key.toLowerCase()}`);

            const finalType = type ?? detectType(raw, attrVal, defaultValue);

            const initial =
                raw !== undefined
                    ? raw
                    : attrVal !== null
                        ? parseAttr(attrVal, finalType)
                        : defaultValue !== undefined
                            ? defaultValue
                            : defaultFor(finalType);

            const s = signal(initial);

            this.#owned.set(key, { s, type: finalType });
            this.#attrToProp.set(`data-${kebab}`, key);
            this.#attrToProp.set(`data-${key.toLowerCase()}`, key);

            const readonly = {
                get value() {
                    return s.value;
                },

                set value(_) {
                    console.warn(
                        `[$$] prop "${key}" is read-only`
                    );
                },

                peek: s.peek.bind(s),
            };

            this.#props.set(key, readonly);

            return readonly;
        }

        #collectSlots() {
            // собираем один раз: после первого рендера в childNodes
            // уже лежит отрисованный результат, а не исходные слоты
            if (this.#slotsCollected) {
                return;
            }

            this.#slotsCollected = true;

            const slots = {
                default: [],
            };

            for (const node of [...this.childNodes]) {
                if (node instanceof Element) {
                    const name = node.getAttribute('data-slot');

                    if (name) {
                        slots[name] ??= [];
                        slots[name].push(...node.childNodes);
                    } else {
                        slots.default.push(node);
                    }
                } else {
                    slots.default.push(node);
                }
            }

            this.#slots = slots;
        }

        #ctx() {
            const slot = Object.assign(
                name => this.#slots[name] ?? [],
                {
                    default: this.#slots.default,
                }
            );

            return {
                $this: this,

                signal,
                computed,
                effect: effectInScope,

                html,

                prop: (name, type, def) =>
                    this.#resolveProp(name, type, def),

                slot,
                bus,
            };
        }

        #onAttributes(mutations) {
            for (const mutation of mutations) {
                const key = this.#attrToProp.get(mutation.attributeName);

                if (!key) {
                    continue;
                }

                const entry = this.#owned.get(key);

                if (!entry) {
                    continue;
                }

                entry.s.value = parseAttr(
                    this.getAttribute(mutation.attributeName),
                    entry.type
                ) ?? defaultFor(entry.type);
            }
        }

        connectedCallback() {
            if (this.#mounted) {
                return;
            }

            this.#mounted = true;

            const scope = createScope();
            this.#scope = scope;

            this.#observer = new MutationObserver(
                mutations => this.#onAttributes(mutations)
            );

            this.#observer.observe(this, {
                attributes: true,
            });

            requestAnimationFrame(() => {
                // сравниваем с локальным scope: если элемент успели
                // отключить и подключить заново, этот колбэк устарел
                if (
                    !this.#mounted ||
                    this.#scope !== scope ||
                    scope.disposed
                ) {
                    return;
                }

                try {
                    this.#collectSlots();

                    withScope(scope, () => {
                        const renderFn = setup(
                            this.#ctx(),
                            createStateAccess()
                        );

                        if (typeof renderFn === 'function') {
                            const clean = uRender(
                                this,
                                renderFn
                            );

                            if (typeof clean === 'function') {
                                addCleanup(clean);
                            }
                        }
                    });
                } catch (e) {
                    console.error(
                        `[$$] error mounting <${tagName}>:`,
                        e
                    );

                    this.#teardown();
                }
            });
        }

        disconnectedCallback() {
            this.#teardown();
        }

        #teardown() {
            this.#mounted = false;

            this.#observer?.disconnect();
            this.#observer = null;

            disposeScope(this.#scope);
            this.#scope = null;

            // при повторном подключении setup выполнится заново,
            // поэтому пропсы должны быть созданы с нуля
            this.#props.clear();
            this.#owned.clear();
            this.#attrToProp.clear();
        }
    }

    customElements.define(tagName, Component);
}