// component.ts
import { reactive } from 'uhtml/reactive';
import { effect as signalEffect, Signal, signal, computed } from './state';
import { html, htmlFor } from 'uhtml/reactive';
import {
    createHooksContext,
    pushContext,
    popContext,
    type HooksContext
} from './hooks';

type TypeConstructor = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor;

type InferPropType<T extends TypeConstructor> =
    T extends StringConstructor ? string :
    T extends NumberConstructor ? number :
    T extends BooleanConstructor ? boolean :
    T extends ArrayConstructor ? any[] :
    T extends ObjectConstructor ? Record<string, unknown> :
    never;

type PropConfig<T extends TypeConstructor = TypeConstructor> = {
    name: string;
    type: T;
    default?: InferPropType<T>;
};

type SlotFunction = {
    (name: string): Node[];
    default: Node[];
};

type ComponentContext = {
    signal: <T>(initialValue: T) => Signal<T>;
    effect: typeof signalEffect;
    computed: typeof computed;
    html: typeof html;
    htmlFor: typeof htmlFor;
    prop: <T extends TypeConstructor>(config: PropConfig<T>) => Signal<InferPropType<T>>;
    slot: SlotFunction;
};

type RenderFunction = () => unknown;

export interface CustomElement extends HTMLElement {
    $<T = any>(key: string): T | undefined;
    emitEvent<T = any>(name: string, detail?: T): void;
}

export function def(
    tagName: string,
    setup: (context: ComponentContext) => RenderFunction
): void {
    const uRender = reactive(signalEffect);

    class Component extends HTMLElement implements CustomElement {
        private hooksContext: HooksContext;
        private cleanup: (() => void)[] = [];
        private isMounted: boolean = false;
        private slots: Record<string, Node[]> = { default: [] };
        private props: Map<string, Signal<any>> = new Map();
        private observedProps: Set<string> = new Set();

        static get observedAttributes() {
            return Array.from(this.prototype.observedProps || []).map(name => `data-${name}`);
        }

        constructor() {
            super();
            this.hooksContext = createHooksContext();
        }

        public $<T = any>(key: string): T | undefined {
            return (this as any)[key];
        }

        public emitEvent<T = any>(name: string, detail?: T): void {
            this.dispatchEvent(new CustomEvent(name, { detail }));
        }

        private createComponentContext(): ComponentContext {
            const self = this;

            const slotFn = Object.assign(
                (name: string) => this.slots[name] || [],
                { default: this.slots.default }
            );

            return {
                signal,
                effect: signalEffect,
                computed,
                html,
                htmlFor,
                prop: <T extends TypeConstructor>(config: PropConfig<T>) => {
                    const { name, type, default: defaultValue } = config;
                    this.observedProps.add(name);

                    const attrName = `data-${name}`;
                    const attrValue = this.getAttribute(attrName);
                    const initialValue = attrValue !== null
                        ? this.parseAttributeValue(attrValue, type)
                        : (defaultValue ?? this.getDefaultForType(type));

                    const propSignal = signal(initialValue);
                    this.props.set(name, propSignal);
                    return propSignal as Signal<InferPropType<T>>;
                },
                slot: slotFn,
            };
        }

        private getDefaultForType(type: TypeConstructor): any {
            switch (type) {
                case String: return '';
                case Number: return 0;
                case Boolean: return false;
                case Object: return {};
                case Array: return [];
                default: return null;
            }
        }

        private parseAttributeValue(value: string, type: TypeConstructor): any {
            switch (type) {
                case Number:
                    return Number(value);
                case Boolean:
                    return value !== null && value !== 'false';
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

        private collectSlots() {
            const slots: Record<string, Node[]> = { default: [] };

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

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            const propName = name.replace(/^data-/, '');
            const propSignal = this.props.get(propName);
            if (propSignal) {
                const type = this.getTypeFromValue(propSignal.value);
                propSignal.value = this.parseAttributeValue(newValue, type);
            }
        }

        private getTypeFromValue(value: any): TypeConstructor {
            switch (typeof value) {
                case 'string': return String;
                case 'number': return Number;
                case 'boolean': return Boolean;
                case 'object':
                    return Array.isArray(value) ? Array : Object;
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
            this.cleanup.forEach(cleanup => cleanup());
            this.cleanup = [];
            this.hooksContext.cleanups.forEach(cleanup => cleanup());
            this.hooksContext.cleanups = [];
        }

        private handleMountError(error: unknown) {
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