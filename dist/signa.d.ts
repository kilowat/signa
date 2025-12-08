// src/signa.d.ts

declare global {
    interface StoreRegistry {

    }
    const signa: {
        // -------------------------
        // Signals (preact-like)
        // -------------------------
        signal<T = any>(initial?: T): signa.Signal<T>;
        computed<T = any>(fn: () => T): signa.ReadonlySignal<T>;
        effect(fn: () => any): () => void;

        // -------------------------
        // Component
        // -------------------------
        defComponent(tagName: string, setup: (ctx: signa.ComponentContext) => (() => any) | void): void;

        // -------------------------
        // App context (DI)
        // -------------------------
        provide<T = any>(key: string, value: T): void;
        inject<T = any>(key: string): T;
        getAppContext(): Map<string, any>;

        // -------------------------
        // Store system
        // -------------------------
        defStore(key: string, factory: (ctx: signa.StoreContext) => any): void;
        resolveStore<T = any>(key: string): T;
        resetStore(key: string): void;
        clearAllStores(): void;

        // -------------------------
        // Event bus
        // -------------------------
        eventBus: signa.EventBus;

        // -------------------------
        // Lifecycle
        // -------------------------
        componentStart(): void;
        componentRendered(): void;
        onSignaReady(cb: () => void): void;

        // -------------------------
        // Router
        // -------------------------
        createRouter(routes: signa.RouteDefinition[]): signa.Router;
    };

    namespace signa {
        // -------------------------
        // Signals (preact-like)
        // -------------------------
        interface ReadonlySignal<T = any> {
            readonly value: T;
            peek(): T;
        }

        interface Signal<T = any> extends ReadonlySignal<T> {
            value: T;
        }

        // -------------------------
        // Component context
        // -------------------------
        interface PropOptions<T = any> {
            name: string;
            type?: any;
            default?: T;
            readonly?: boolean;
        }

        type SlotFn = ((name?: string) => any[]) & { default: any[] };

        interface ComponentContext {
            $this: HTMLElement;
            html: (strings: TemplateStringsArray, ...values: any[]) => any;
            htmlFor: (ref: any) => any;
            signal: <T = any>(initial?: T) => Signal<T>;
            computed: <T = any>(fn: () => T) => ReadonlySignal<T>;
            effect: (fn: () => any) => void;
            prop(opt: PropOptions & { type: FunctionConstructor }): (...args: any[]) => any;
            prop(opt: PropOptions & { type: StringConstructor }): Signal<string>;
            prop(opt: PropOptions & { type: NumberConstructor }): Signal<number>;
            prop(opt: PropOptions & { type: BooleanConstructor }): Signal<boolean>;
            prop(opt: PropOptions & { type: ObjectConstructor }): Signal<Record<string, any>>;
            prop(opt: PropOptions & { type: ArrayConstructor }): Signal<any[]>;
            prop<T>(opt: PropOptions<T> & { readonly: true }): ReadonlySignal<T>;
            prop<T>(opt: PropOptions<T>): Signal<T>;
            slot: SlotFn;

            // ✨ Улучшенная типизация store
            store<K extends keyof StoreRegistry>(key: K): StoreRegistry[K];
            store<T = any>(key: string): T;

            effectWithCleanup?: (fn: () => void | (() => void)) => void;
        }

        // -------------------------
        // Store context
        // -------------------------
        interface StoreContext {
            signal: <T = any>(initial?: T) => Signal<T>;
            effect: (fn: () => any) => void;
            computed: <T = any>(fn: () => T) => ReadonlySignal<T>;
        }

        // -------------------------
        // Event bus
        // -------------------------
        interface EventBus {
            emit(type: string, payload?: any): void;
            on(type: string, handler: (payload: any) => void): void;
        }

        // -------------------------
        // Router
        // -------------------------
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
            View(): any;
        }
    }
}

export { };