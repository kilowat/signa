import type {
    Signal as PreactSignal,
    ReadonlySignal as PreactReadonlySignal,
} from '@preact/signals-core';

declare global {
    type Signal<T = any> = PreactSignal<T>;
    type ReadonlySignal<T = any> = PreactReadonlySignal<T>;

    // ---- Bus ----

    interface Bus {
        emit(type: string, payload?: any): void;
        on(type: string, handler: (payload: any) => void): () => void;
    }

    // ---- Router ----

    interface RouteDefinition {
        name?: string;
        path: string;
        render: (params?: Record<string, string>) => any;
    }

    interface Router {
        current: ReadonlySignal<{ path: string; params: Record<string, string>; route: RouteDefinition }>;
        navigate(nameOrPath: string, params?: Record<string, any>): void;
        route(name: string, params?: Record<string, any>): string;
        view(): any;
    }

    // ---- State context ----

    interface StateContext {
        signal: <T>(initial?: T) => Signal<T>;
        computed: <T>(fn: () => T) => ReadonlySignal<T>;
        effect: (fn: () => any) => void;
        state<T = any>(key: string): T;
    }

    // ---- Prop types ----

    type PropType<T> =
        T extends typeof String ? ReadonlySignal<string> :
        T extends typeof Number ? ReadonlySignal<number> :
        T extends typeof Boolean ? ReadonlySignal<boolean> :
        T extends typeof Object ? ReadonlySignal<object> :
        T extends typeof Array ? ReadonlySignal<any[]> :
        T extends FunctionConstructor ? Function :
        never;

    type SlotFn = ((name?: string) => Node[]) & { default: Node[] };

    // ---- Component context ----

    interface ComponentContext {
        $this: HTMLElement;
        html: (strings: TemplateStringsArray, ...values: any[]) => any;
        signal: <T>(initial?: T) => Signal<T>;
        computed: <T>(fn: () => T) => ReadonlySignal<T>;
        effect: (fn: () => (() => void) | void) => void;
        prop<T extends typeof String | typeof Number | typeof Boolean | typeof Object | typeof Array | FunctionConstructor>(
            name: string, type?: T, defaultValue?: any
        ): PropType<T>;
        slot: SlotFn;
        state: <T = any>(key: string) => T;
        bus: Bus;
    }

    // ---- Global sig() ----

    interface Sig {
        // define component
        (tagName: string, setup: (ctx: ComponentContext) => (() => any) | void): void;
        // define state / composable
        (key: string, factory: (ctx: StateContext) => any): void;
        // get state instance
        <T = any>(key: string): T;
        // create router
        router(routes: RouteDefinition[]): Router;
    }

    const sig: Sig;
}

export { };