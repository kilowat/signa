import { ReadonlySignal, Signal } from '@preact/signals-core';
export declare class State<T> extends Signal<T> {
    emit(value: Partial<T> | T): void;
}
export declare function createState<T>(initialValue: T): State<T>;
export declare function compute<S, R>(signal: Signal<S>, computeFn: (state: S) => R): ReadonlySignal<R>;
