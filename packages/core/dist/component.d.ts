import { ReadonlySignal } from '@preact/signals-core';
type TypeConstructor = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor;
type ConstructorToType<T> = T extends StringConstructor ? string : T extends NumberConstructor ? number : T extends BooleanConstructor ? boolean : T extends ArrayConstructor ? any[] : T extends ObjectConstructor ? Record<string, unknown> : T;
type PropDefinition<T extends TypeConstructor> = {
    type: T;
    default?: ConstructorToType<T>;
};
type InferPropType<T> = T extends PropDefinition<infer U> ? ConstructorToType<U> : never;
type ReadonlySignalProps<T extends Record<string, PropDefinition<any>>> = {
    [K in keyof T]: ReadonlySignal<InferPropType<T[K]>>;
};
type SetupContext<P extends Record<string, PropDefinition<any>>> = {
    readonly props: ReadonlySignalProps<P>;
};
type SetupResult = Record<string, any>;
type Slots = string[] | undefined;
type InferSlots<T extends Slots> = T extends string[] ? Record<T[number] | 'default', Node[]> : Record<'default', Node[]>;
export interface CustomElement extends HTMLElement {
    $<T = any>(key: string): T | undefined;
    emitEvent<T = any>(name: string, detail?: T): void;
    slots: Record<string, Node[]>;
}
type This<P extends Record<string, PropDefinition<any>>, S, SL extends Slots> = CustomElement & ReadonlySignalProps<P> & S & {
    slots: InferSlots<SL>;
};
type ComponentOptions<P extends Record<string, PropDefinition<any>>, S extends SetupResult, SL extends Slots = undefined> = {
    tagName: string;
    props?: P;
    slots?: SL;
    setup?: (context: SetupContext<P>) => S;
    connected?: (this: This<P, S, SL>) => void;
    render?: (this: This<P, S, SL>) => unknown;
    disconnected?: (this: This<P, S, SL>) => void;
};
export declare function def<P extends Record<string, PropDefinition<any>>, S extends SetupResult, SL extends Slots = undefined>(options: ComponentOptions<P, S, SL>): void;
export {};
