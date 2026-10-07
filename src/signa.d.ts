import type {
    Signal as PreactSignal,
    ReadonlySignal as PreactReadonlySignal,
} from '@preact/signals-core';

declare global {

    type Signal<T = any> = PreactSignal<T>;

    type ReadonlySignal<T = any> = PreactReadonlySignal<T>;

    /**
     * Реестр состояний. Расширяется через declaration merging:
     *
     *   interface SigRegistry { counter: { count: Signal<number> } }
     *
     * После этого $$('counter') и $$.app.counter типизированы.
     */
    interface SigRegistry { }

    // ---------------------------------------------------------------
    // Bus
    // ---------------------------------------------------------------

    interface Bus {
        emit(
            type: string,
            payload?: any
        ): void;

        /** Возвращает функцию отписки. */
        on(
            type: string,
            handler: (payload: any) => void
        ): () => void;
    }

    // ---------------------------------------------------------------
    // Router
    // ---------------------------------------------------------------

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

    // ---------------------------------------------------------------
    // Location
    //
    // Назван SignaLocation, а не Location: глобальный Location из lib.dom
    // слился бы с этим интерфейсом и "загрязнил" тип window.location.
    // ---------------------------------------------------------------

    type LocationQuery = Record<string, string | string[]>;

    type LocationValue =
        | string
        | number
        | boolean
        | string[]
        | number[]
        | null
        | undefined;

    interface LocationState {
        url: string;
        path: string;
        hash: string;
        query: LocationQuery;
    }

    interface SignaLocation {
        current: ReadonlySignal<LocationState>;

        query: ReadonlySignal<LocationQuery>;

        url(): string;
        url(value: string): string;

        path(): string;
        path(value: string): string;

        get(key: string): string | string[] | undefined;

        getAll(): LocationQuery;

        /** null / undefined удаляют ключ. Без записи в историю. */
        set(key: string, value: LocationValue): string;
        set(values: Record<string, LocationValue>): string;

        /** Полная перезагрузка страницы. */
        go(value?: string): void;

        /** Меняет URL без новой записи в истории. */
        replace(value?: string): string;

        /** Меняет URL с новой записью в истории. */
        push(value?: string): string;

        back(): void;

        forward(): void;
    }

    // ---------------------------------------------------------------
    // Props
    // ---------------------------------------------------------------

    type PropConstructor =
        | StringConstructor
        | NumberConstructor
        | BooleanConstructor
        | ObjectConstructor
        | ArrayConstructor
        | FunctionConstructor;

    type PropValue<T extends PropConstructor> =
        T extends StringConstructor ? string
        : T extends NumberConstructor ? number
        : T extends BooleanConstructor ? boolean
        : T extends ArrayConstructor ? any[]
        : T extends ObjectConstructor ? Record<string, any>
        : T extends FunctionConstructor ? Function
        : never;

    /**
     * Что реально возвращает prop(): объект с value/peek.
     * Если родитель передал настоящий сигнал, придёт он сам
     * (он тоже подходит под этот тип).
     */
    interface Prop<T = any> {
        readonly value: T;
        peek(): T;
    }

    type PropType<T extends PropConstructor> =
        T extends FunctionConstructor
        ? Function
        : Prop<PropValue<T>>;

    type SlotFn =
        ((name?: string) => Node[]) & {
            default: Node[];
        };

    type StateAccess =
        SigRegistry & {
            [key: string]: any;
        };

    // ---------------------------------------------------------------
    // Contexts
    // ---------------------------------------------------------------

    type HtmlTag = (
        strings: TemplateStringsArray,
        ...values: any[]
    ) => any;

    interface BaseContext {
        signal: <T>(initial?: T) => Signal<T>;

        computed: <T>(fn: () => T) => ReadonlySignal<T>;

        /** Эффект живёт в scope и останавливается автоматически. Возвращает stop. */
        effect: (
            fn: () => (() => void) | void
        ) => () => void;

        html: HtmlTag;

        location: SignaLocation;
    }

    interface StateContext extends BaseContext {
        state: <T = any>(key: string) => T;
    }

    interface ComponentContext extends BaseContext {
        $this: HTMLElement;

        prop<T extends PropConstructor>(
            name: string,
            type: T,
            defaultValue?: PropValue<T>
        ): PropType<T>;

        prop<V = any>(
            name: string,
            type?: undefined,
            defaultValue?: V
        ): Prop<V>;

        slot: SlotFn;

        bus: Bus;
    }

    // ---------------------------------------------------------------
    // $$
    // ---------------------------------------------------------------

    interface $$ {
        /** Компонент: имя тега обязательно содержит дефис. */
        (
            tagName: `${string}-${string}`,
            setup: (
                ctx: ComponentContext,
                states: StateAccess
            ) => (() => any) | void
        ): void;

        /** Состояние. */
        <K extends string>(
            key: K,
            factory: (
                ctx: StateContext,
                states: StateAccess
            ) => any
        ): void;

        <K extends keyof SigRegistry>(key: K): SigRegistry[K];

        <T = any>(key: string): T;

        router(
            routes: RouteDefinition[],
            options?: {
                mode?: 'hash' | 'history';
            }
        ): Router;

        location: SignaLocation;

        bus: Bus;

        /** Все зарегистрированные состояния (ленивые геттеры). */
        app: StateAccess;
    }

    // var, а не const: тогда доступно и как window.$$
    var $$: $$;
}

export { };