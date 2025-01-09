export interface State<T> {
    value: T;
    emit(value: Partial<T> | T): void;
    peek(): T;
    subscribe(fn: () => void): () => void;
}
export declare function useState<T>(initialValue: T): State<T>;
export declare function computed<T>(fn: () => T): import("@preact/signals-core").ReadonlySignal<T>;
