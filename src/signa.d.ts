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

        prop<T extends Function>(options: PropOptions<T> & { readonly?: false }): T;
        prop<T extends Function>(options: PropOptions<T> & { readonly: true }): T;

        prop<T, R extends boolean | undefined = false>(
            options: PropOptions<T> & { readonly?: R }
        ): PropReturn<T, R>;

        prop<T>(opt: PropOptions<T>): Signal<T>;

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

    type PropOptions<T> = {
        name: string;
        type: new (...args: any[]) => T;
        default?: T;
        readonly?: boolean;
    };

    type PropReturn<T, R extends boolean | undefined> =
        T extends Function
        ? T
        : R extends true
        ? ReadonlySignal<T>
        : Signal<T>;

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
