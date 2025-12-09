// signa.d.ts
import type {
    Signal as PreactSignal,
    ReadonlySignal as PreactReadonlySignal,
} from '@preact/signals-core';

declare global {
    type Signal<T = any> = PreactSignal<T>;
    type ReadonlySignal<T = any> = PreactReadonlySignal<T>;

    interface StoreRegistry { }

    const signa: {
        signal<T = any>(initial?: T): Signal<T>;
        computed<T = any>(fn: () => T): ReadonlySignal<T>;
        effect(fn: () => any): () => void;

        defComponent(
            tagName: string,
            setup: (ctx: ComponentContext) => (() => any) | void
        ): void;

        provide<T = any>(key: string, value: T): void;
        inject<T = any>(key: string): T;
        getAppContext(): Map<string, any>;

        defStore(key: string, factory: (ctx: StoreContext) => any): void;
        resolveStore<T = any>(key: string): T;
        resetStore(key: string): void;
        clearAllStores(): void;

        eventBus: EventBus;

        componentStart(): void;
        componentRendered(): void;
        onSignaReady(cb: () => void): void;

        createRouter(routes: RouteDefinition[]): Router;
    };

    interface ComponentContext {
        $this: HTMLElement;
        html: (strings: TemplateStringsArray, ...values: any[]) => any;
        htmlFor: (ref: any) => any;

        signal: <T = any>(initial?: T) => Signal<T>;
        computed: <T = any>(fn: () => T) => ReadonlySignal<T>;
        effect: (fn: () => any) => void;

        // Function props - возвращаются как есть
        prop(options: { name: string; type: FunctionConstructor; default?: Function }): Function;

        // Signal type - возвращает readonly Signal
        prop(options: { name: string; type: 'Signal'; default?: never }): ReadonlySignal<any>;

        // String type
        prop(options: { name: string; type: StringConstructor; default?: string }): string;

        // Number type
        prop(options: { name: string; type: NumberConstructor; default?: number }): number;

        // Boolean type
        prop(options: { name: string; type: BooleanConstructor; default?: boolean }): boolean;

        // Object type
        prop(options: { name: string; type: ObjectConstructor; default?: object }): object;

        // Array type
        prop(options: { name: string; type: ArrayConstructor; default?: any[] }): any[];

        slot: SlotFn;

        store<K extends keyof StoreRegistry>(key: K): StoreRegistry[K];
        store<T = any>(key: string): T;

        effectWithCleanup?: (fn: () => void | (() => void)) => void;
    }

    interface StoreContext {
        signal: <T = any>(initial?: T) => Signal<T>;
        computed: <T = any>(fn: () => T) => ReadonlySignal<T>;
        effect: (fn: () => any) => void;
    }



    type SlotFn = ((name?: string) => any[]) & { default: any[] };

    interface EventBus {
        emit(type: string, payload?: any): void;
        on(type: string, handler: (payload: any) => void): void;
    }

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
        route(name: string, params?: Record<string, any>): string;
        navigate(nameOrPath: string, params?: Record<string, any>): void;
        view(): any;
    }
}

export { };