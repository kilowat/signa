import type {
    Signal as PreactSignal,
    ReadonlySignal as PreactReadonlySignal,
} from '@preact/signals-core';

declare global {

    type Signal<T = any> = PreactSignal<T>;

    type ReadonlySignal<T = any> = PreactReadonlySignal<T>;

    interface SigRegistry { }

    interface Bus {
        emit(
            type: string,
            payload?: any
        ): void;

        on(
            type: string,
            handler: (payload: any) => void
        ): () => void;
    }

    interface RouteDefinition {
        name?: string;
        path: string;

        render(
            params?: Record<string, string>
        ): any;
    }

    interface Router {
        current: ReadonlySignal<{
            path: string;
            params: Record<string, string>;
            route: RouteDefinition;
        }>;

        go(
            nameOrPath: string,
            params?: Record<string, any>
        ): string;

        route(
            name: string,
            params?: Record<string, any>
        ): string;

        view(): any;
    }

    interface LocationState {
        url: string;
        path: string;
        query: Record<string, string | string[]>;
    }

    interface Location {
        current: ReadonlySignal<LocationState>;

        query: ReadonlySignal<
            Record<string, string | string[]>
        >;

        url(): string;

        url(value: string): string;

        path(): string;

        path(value: string): string;

        get(
            key: string
        ): string | string[] | undefined;

        getAll(): Record<string, string | string[]>;

        set(
            key: string,
            value: string | number | boolean | null
        ): string;

        set(
            values: Record<
                string,
                string | number | boolean | string[] | number[] | null
            >
        ): string;

        go(
            value?: string
        ): void;

        replace(
            value?: string
        ): string;

        back(): void;

        forward(): void;
    }

    interface StateContext {
        signal: <T>(
            initial?: T
        ) => Signal<T>;

        computed: <T>(
            fn: () => T
        ) => ReadonlySignal<T>;

        effect: (
            fn: () => (() => void) | void
        ) => void;

        html: (
            strings: TemplateStringsArray,
            ...values: any[]
        ) => any;

        state: <T = any>(
            key: string
        ) => T;
    }

    type PropType<T> =
        T extends typeof String
        ? ReadonlySignal<string>
        : T extends typeof Number
        ? ReadonlySignal<number>
        : T extends typeof Boolean
        ? ReadonlySignal<boolean>
        : T extends typeof Object
        ? ReadonlySignal<object>
        : T extends typeof Array
        ? ReadonlySignal<any[]>
        : T extends FunctionConstructor
        ? Function
        : never;

    type SlotFn =
        ((name?: string) => Node[]) & {
            default: Node[];
        };

    type StateAccess =
        SigRegistry & {
            [key: string]: any;
        };

    interface ComponentContext {
        $this: HTMLElement;

        html: (
            strings: TemplateStringsArray,
            ...values: any[]
        ) => any;

        signal: <T>(
            initial?: T
        ) => Signal<T>;

        computed: <T>(
            fn: () => T
        ) => ReadonlySignal<T>;

        effect: (
            fn: () => (() => void) | void
        ) => void;

        prop<
            T extends
            typeof String |
            typeof Number |
            typeof Boolean |
            typeof Object |
            typeof Array |
            FunctionConstructor
        >(
            name: string,
            type?: T,
            defaultValue?: any
        ): PropType<T>;

        slot: SlotFn;

        bus: Bus;
    }

    interface $$ {
        (
            tagName: string,
            setup: (
                ctx: ComponentContext,
                states: StateAccess
            ) => (() => any) | void
        ): void;

        <K extends string>(
            key: K,
            factory: (
                ctx: StateContext,
                states: StateAccess
            ) => any
        ): void;

        <K extends keyof SigRegistry>(
            key: K
        ): SigRegistry[K];

        <T = any>(
            key: string
        ): T;

        router(
            routes: RouteDefinition[],
            options?: {
                mode?: 'hash' | 'history';
            }
        ): Router;

        location: Location;
    }

    const $$: $$;
}

export { };