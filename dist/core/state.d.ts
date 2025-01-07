import { Signal } from '@preact/signals-core';
export declare class State<T> extends Signal<T> {
    emit(value: Partial<T> | T): void;
}
export declare function useState<T>(initialValue: T): State<T>;
export declare function computed<T>(fn: () => T): import("@preact/signals-core").ReadonlySignal<T>;
