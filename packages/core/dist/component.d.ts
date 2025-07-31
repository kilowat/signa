import { effect, Signal, computed } from '@preact/signals-core';
import { html, htmlFor } from 'uhtml/reactive';
type TypeConstructor = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor;
type InferPropType<T extends TypeConstructor> = T extends StringConstructor ? string : T extends NumberConstructor ? number : T extends BooleanConstructor ? boolean : T extends ArrayConstructor ? any[] : T extends ObjectConstructor ? Record<string, unknown> : never;
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
    effect: typeof effect;
    computed: typeof computed;
    html: typeof html;
    htmlFor: typeof htmlFor;
    prop: <T extends TypeConstructor>(config: PropConfig<T>) => Signal<InferPropType<T>>;
    slot: SlotFunction;
    useStore: <T = any>(key: string) => T;
};
type RenderFunction = () => unknown;
export interface CustomElement extends HTMLElement {
    $<T = any>(key: string): T | undefined;
    emitEvent<T = any>(name: string, detail?: T): void;
}
export declare function defComponent(tagName: string, setup: (context: ComponentContext) => RenderFunction): void;
export {};
