// signa.d.ts
import type {
    Signal as PreactSignal,
    ReadonlySignal as PreactReadonlySignal,
} from "@preact/signals-core";

declare global {
    // Base signal types 
    type Signal<T = any> = PreactSignal<T>;
    type ReadonlySignal<T = any> = PreactReadonlySignal<T>;

    // -----------------------------
    // Store system
    // -----------------------------
    interface StoreContext {
        signal: <T = any>(initial?: T) => Signal<T>;
        computed: <T = any>(fn: () => T) => ReadonlySignal<T>;
        effect: (fn: () => any) => void;
    }

    interface StoreRegistry {
        [key: string]: any;
    }

    // -----------------------------
    // Slots
    // -----------------------------
    type SlotFn = ((name?: string) => any[]) & {
        default: any[];
    };

    // -----------------------------
    // Router
    // -----------------------------
    interface RouteDefinition {
        name?: string;
        path: string;
        render: (params?: Record<string, string>) => any;
    }

    interface ParsedRoute {
        path: string;
        params: Record<string, string>;
        route: RouteDefinition;
    }

    interface Router {
        current: ReadonlySignal<ParsedRoute>;
        navigate(nameOrPath: string, params?: Record<string, any>): void;
        route(name: string, params?: Record<string, any>): string;
        view(): any;
    }

    // -----------------------------
    // Event bus
    // -----------------------------
    interface EventBus {
        emit(type: string, payload?: any): void;
        on(type: string, handler: (payload: any) => void): void;
    }

    // -----------------------------
    // Component context
    // -----------------------------
    interface ComponentContext {
        $this: HTMLElement;

        // template
        html: (strings: TemplateStringsArray, ...values: any[]) => any;
        htmlFor: (ref: any) => any;

        // signals
        signal: <T = any>(initial?: T) => Signal<T>;
        computed: <T = any>(fn: () => T) => ReadonlySignal<T>;
        effect: (fn: () => any) => void;

        // props
        prop(options: { name: string; type: "Signal" }): ReadonlySignal<any>;
        prop(options: { name: string; type: typeof String; default?: string }): string;
        prop(options: { name: string; type: typeof Number; default?: number }): number;
        prop(options: { name: string; type: typeof Boolean; default?: boolean }): boolean;
        prop(options: { name: string; type: typeof Object; default?: object }): object;
        prop(options: { name: string; type: typeof Array; default?: any[] }): any[];
        prop(options: { name: string; type: FunctionConstructor }): Function;

        // slots
        slot: SlotFn;

        // store
        store<T = any>(key: string): T;

        // DI
        provide<T = any>(key: string, value: T): void;
        inject<T = any>(key: string): T;

        // router factory
        createRouter(routes: RouteDefinition[]): Router;

        // event bus injected into context
        eventBus: EventBus;
    }

    // -----------------------------
    // Global API (ONLY THESE 2!)
    // -----------------------------
    const defComponent: (
        tagName: string,
        setup: (ctx: ComponentContext) => (() => any) | void
    ) => void;

    const defStore: (
        key: string,
        factory: (ctx: StoreContext) => any
    ) => void;
}

export { };
