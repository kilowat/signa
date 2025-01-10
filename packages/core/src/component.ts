import { reactive } from 'uhtml/reactive';
import { effect, Signal, signal } from './state';
import {
    createHooksContext,
    pushContext,
    popContext,
    type HooksContext
} from './hooks';

type TypeConstructor = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor;

type ConstructorToType<T> =
    T extends StringConstructor ? string :
    T extends NumberConstructor ? number :
    T extends BooleanConstructor ? boolean :
    T extends ArrayConstructor ? any[] :
    T extends ObjectConstructor ? Record<string, unknown> :
    T;

type PropDefinition<T extends TypeConstructor> = {
    type: T;
    default?: ConstructorToType<T>;
};

type InferPropType<T> = T extends PropDefinition<infer U> ? ConstructorToType<U> : never;

type SignalProps<T extends Record<string, PropDefinition<any>>> = {
    [K in keyof T]: Signal<InferPropType<T[K]>>;
};

type SetupContext<P extends Record<string, PropDefinition<any>>> = {
    props: SignalProps<P>;
}

type SetupResult = Record<string, any>;

type Slots = string[] | undefined;
type InferSlots<T extends Slots> = T extends string[]
    ? Record<T[number] | 'default', Node[]>
    : Record<'default', Node[]>;

export interface CustomElement extends HTMLElement {
    $<T = any>(key: string): T | undefined;
    emitEvent<T = any>(name: string, detail?: T): void;
    slots: Record<string, Node[]>;
}

type ComponentInstance<P extends Record<string, PropDefinition<any>>, S, SL extends Slots> =
    CustomElement &
    SignalProps<P> &
    S & {
        slots: InferSlots<SL>;
    };

type ComponentOptions<
    P extends Record<string, PropDefinition<any>>,
    S extends SetupResult,
    SL extends Slots = undefined
> = {
    tagName: string;
    props?: P;
    slots?: SL;
    setup?: (context: SetupContext<P>) => S;
    connected?: (this: ComponentInstance<P, S, SL>) => void;
    render?: (this: ComponentInstance<P, S, SL>) => unknown;
    disconnected?: (this: ComponentInstance<P, S, SL>) => void;
};

export function def<
    P extends Record<string, PropDefinition<any>>,
    S extends SetupResult,
    SL extends Slots = undefined
>(options: ComponentOptions<P, S, SL>) {
    const {
        tagName,
        props: propsDefinition = {} as P,
        slots: slotsDefinition,
        setup,
        connected,
        disconnected,
        render,
    } = options;

    const uRender = reactive(effect);

    abstract class BaseComponent extends HTMLElement implements CustomElement {
        public slots!: InferSlots<SL>;

        public $<T = any>(key: string): T | undefined {
            return (this as any)[key];
        }

        public emitEvent<T = any>(name: string, detail?: T): void {
            this.dispatchEvent(new CustomEvent(name, { detail }));
        }
    }

    class Component extends BaseComponent {
        private propsSignals: SignalProps<P>;
        private setupResult: S;
        private hooksContext: HooksContext;
        private cleanup: (() => void)[] = [];

        static get observedAttributes() {
            return Object.keys(propsDefinition).map(name => `data-${name}`);
        }

        constructor() {
            super();
            this.hooksContext = createHooksContext();
            this.propsSignals = this.initializeProps();

            Object.keys(this.propsSignals).forEach(key => {
                (this as any)[key] = this.propsSignals[key];
            });

            // Setup phase with hooks
            if (setup) {
                pushContext(this.hooksContext, 'setup');
                this.setupResult = setup({
                    props: this.propsSignals,
                }) || {} as S;
                popContext();
            } else {
                this.setupResult = {} as S;
            }

            Object.entries(this.setupResult).forEach(([key, value]) => {
                if (typeof value === 'function') {
                    (this as any)[key] = value.bind(this);
                } else {
                    (this as any)[key] = value;
                }
            });
        }

        private initializeProps(): SignalProps<P> {
            const signals = {} as SignalProps<P>;

            for (const [key, definition] of Object.entries(propsDefinition)) {
                const attrName = `data-${key}`;
                const attrValue = this.getAttribute(attrName);
                const defaultValue = definition.default ?? this.getDefaultForType(definition.type);
                const initialValue = attrValue !== null
                    ? this.parseAttributeValue(attrValue, definition.type)
                    : defaultValue;

                signals[key as keyof P] = signal(initialValue);
            }

            return signals;
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

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            const propName = name.replace(/^data-/, '') as keyof P;
            const propDef = propsDefinition[propName];
            if (!propDef) return;
            const value = this.parseAttributeValue(newValue, propDef.type);
            this.propsSignals[propName].value = value;
        }

        private setupRender() {
            if (!render) return;
            const cleanup = uRender(this, () => {
                return render.call(this as unknown as ComponentInstance<P, S, SL>);
            });
            this.cleanup.push(cleanup);
        }

        connectedCallback() {
            requestAnimationFrame(() => {
                this.collectSlots();
                this.setupRender();

                // Connected phase with hooks
                if (connected) {
                    pushContext(this.hooksContext, 'connected');
                    connected.call(this as unknown as ComponentInstance<P, S, SL>);
                    popContext();
                }
            });
        }

        disconnectedCallback() {
            // Disconnected phase with hooks
            if (disconnected) {
                pushContext(this.hooksContext, 'disconnected');
                disconnected.call(this as unknown as ComponentInstance<P, S, SL>);
                popContext();
            }

            // Очищаем все эффекты и сигналы
            this.hooksContext.cleanups.forEach(cleanup => cleanup());
            this.hooksContext.cleanups = [];

            // Очищаем рендер эффекты
            this.cleanup.forEach(cleanup => cleanup());
            this.cleanup = [];
        }

        private collectSlots() {
            const slots: Record<string, Node[]> = { default: [] };

            if (slotsDefinition) {
                slotsDefinition.forEach(slot => {
                    slots[slot] = [];
                });
            }

            Array.from(this.childNodes).forEach(node => {
                if (node instanceof Element) {
                    const slotName = node.getAttribute('data-slot') || 'default';
                    if (slotName !== 'default' && slotsDefinition && !slotsDefinition.includes(slotName)) {
                        console.warn(`Slot "${slotName}" is not defined in component slots`);
                        return;
                    }

                    if (node.hasChildNodes()) {
                        slots[slotName] = slots[slotName] || [];
                        slots[slotName].push(...Array.from(node.childNodes));
                    }
                } else if (node.textContent?.trim()) {
                    slots.default.push(node);
                }
            });

            this.slots = slots as InferSlots<SL>;
        }
    }

    if (!customElements.get(tagName)) {
        customElements.define(tagName, Component);
    }
}