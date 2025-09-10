// Типизация глобального объекта signa (IIFE-библиотека)

/** Реактивный сигнал */
interface Signal<T> {
    value: T;
    peek(): T;
}

/** EventBus */
interface EventBus {
    /** Отправка события */
    emit(type: string, payload: any): void;
    /** Подписка на событие */
    on(type: string, handler: (payload: any) => void): void;
}

declare namespace signa {
    /* ==========================================================
       Сигналы (из @preact/signals-core)
       ========================================================== */
    function signal<T>(value: T): Signal<T>;
    function effect(fn: () => void): () => void;
    function computed<T>(fn: () => T): Signal<T>;

    /* ==========================================================
       Компоненты
       ========================================================== */
    /**
     * Определяет Web Component с реактивным рендерингом
     */
    function defComponent(
        tagName: string,
        setup: (ctx: {
            html: typeof import("uhtml").html;
            htmlFor: typeof import("uhtml").html;
            signal: typeof import("@preact/signals-core").signal;
            effect: typeof import("@preact/signals-core").effect;
            computed: typeof import("@preact/signals-core").computed;
            store: <T = any>(key: string) => T;
            slot: (name: string) => Node[];
            prop: <T>(options: { name: string; type: Function; default?: T }) => any;
        }) => () => any
    ): void;

    /* ==========================================================
       Сторы
       ========================================================== */
    /**
     * Определяет новый store
     */
    function defStore(
        key: string,
        setup: (ctx: {
            signal: typeof import("@preact/signals-core").signal;
            effect: typeof import("@preact/signals-core").effect;
            computed: typeof import("@preact/signals-core").computed;
        }) => any
    ): void;

    /**
     * Возвращает ранее созданный store
     */
    function resolveStore<T = any>(key: string): T;

    /** Сбросить один store */
    function resetStore(key: string): void;

    /** Очистить все store */
    function clearAllStores(): void;

    /* ==========================================================
       EventBus
       ========================================================== */
    const eventBus: EventBus;
}
