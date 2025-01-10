import { Signal } from './state';
type TypeConstructor = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor;
type ConstructorToType<T> = T extends StringConstructor ? string : T extends NumberConstructor ? number : T extends BooleanConstructor ? boolean : T extends ArrayConstructor ? any[] : T extends ObjectConstructor ? Record<string, unknown> : T;
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
};
type SetupResult = Record<string, any>;
type Slots = string[] | undefined;
type InferSlots<T extends Slots> = T extends string[] ? Record<T[number] | 'default', Node[]> : Record<'default', Node[]>;
export interface CustomElement extends HTMLElement {
    $<T = any>(key: string): T | undefined;
    emitEvent<T = any>(name: string, detail?: T): void;
    slots: Record<string, Node[]>;
}
type ComponentInstance<P extends Record<string, PropDefinition<any>>, S, SL extends Slots> = CustomElement & SignalProps<P> & S & {
    slots: InferSlots<SL>;
};
type ComponentOptions<P extends Record<string, PropDefinition<any>>, S extends SetupResult, SL extends Slots = undefined> = {
    tagName: string;
    props?: P;
    slots?: SL;
    setup?: (context: SetupContext<P>) => S;
    connected?: (this: ComponentInstance<P, S, SL>) => void;
    render?: (this: ComponentInstance<P, S, SL>) => unknown;
    disconnected?: (this: ComponentInstance<P, S, SL>) => void;
};
/**
 * Define web components
 * @template P - Props type
 * @template S - Setup function result type
 * @template SL - Slot type
 * @param {ComponentOptions<P, S, SL>} options - Confing component
 * @param {string} options.tagName - HTML tag
 * @param {P} [options.props] - Define props
 * @param {SL} [options.slots] - Define slots
 * @param {Function} [options.setup] - Define setup
 * @param {Function} [options.connected] - Callback on connected component to dom
 * @param {Function} [options.render] - Render function
 * @param {Function} [options.disconnected] - Callback on disconnected component from dom
 * @example
 * def({
 *   tagName: 'my-component',
 *   props: {
 *     title: { type: String, default: 'Default Title' }
 *   },
 *   setup({ props }) {
 *     // setup logic
 *   },
 *   render() {
 *     // render logic
 *   }
 * });
 */
export declare function def<P extends Record<string, PropDefinition<any>>, S extends SetupResult, SL extends Slots = undefined>(options: ComponentOptions<P, S, SL>): void;
export {};
