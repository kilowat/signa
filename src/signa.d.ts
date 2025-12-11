// signa.d.ts
import type {
    Signal as PreactSignal,
    ReadonlySignal as PreactReadonlySignal,
} from "@preact/signals-core";

declare global {
    // --------------------------------
    // Signals
    // --------------------------------
    type Signal<T = any> = PreactSignal<T>;
    type ReadonlySignal<T = any> = PreactReadonlySignal<T>;

    // --------------------------------
    // Store system
    // --------------------------------
    interface StoreContext {
        signal: <T = any>(initial?: T) => Signal<T>;
        computed: <T = any>(fn: () => T) => ReadonlySignal<T>;
        effect: (fn: () => any) => void;
    }

    interface StoreRegistry {
        [key: string]: any;
    }

    // --------------------------------
    // Slots
    // --------------------------------
    type SlotFn = ((name?: string) => any[]) & { default: any[] };

    // --------------------------------
    // Router
    // --------------------------------
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

    // --------------------------------
    // Event bus
    // --------------------------------
    interface EventBus {
        emit(type: string, payload?: any): void;
        on(type: string, handler: (payload: any) => void): void;
    }

    // --------------------------------
    // Component context
    // --------------------------------

    // Маппинг типа → тип сигнала
    type PropTypeMap<T> =
        T extends typeof String ? ReadonlySignal<string> :
        T extends typeof Number ? ReadonlySignal<number> :
        T extends typeof Boolean ? ReadonlySignal<boolean> :
        T extends typeof Object ? ReadonlySignal<object> :
        T extends typeof Array ? ReadonlySignal<any[]> :
        T extends FunctionConstructor ? Function :
        never;

    interface ComponentContext {
        $this: HTMLElement;

        html: (strings: TemplateStringsArray, ...values: any[]) => any;
        htmlFor: (ref: any) => any;
        svg: (content: string) => any,
        signal: <T = any>(initial?: T) => Signal<T>;
        computed: <T = any>(fn: () => T) => ReadonlySignal<T>;
        effect: (fn: () => any) => void;

        // -------- prop: строго выводимый тип через PropTypeMap --------
        prop<T extends
            typeof String |
            typeof Number |
            typeof Boolean |
            typeof Object |
            typeof Array |
            FunctionConstructor>(options: {
                name: string;
                type: T;
                default?: any;
            }): PropTypeMap<T>;

        slot: SlotFn;

        store<T = any>(key: string): T;

        provide<T = any>(key: string, value: T): void;
        inject<T = any>(key: string): T;

        createRouter(routes: RouteDefinition[]): Router;

        eventBus: EventBus;
    }

    // --------------------------------
    // Global API
    // --------------------------------
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
