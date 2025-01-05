import { Signal } from '@preact/signals-core';
import { ComputedProperties } from './component';
export declare class State<T> extends Signal<T> {
    emit(value: Partial<T> | T): void;
}
export declare function createState<T>(initialValue: T): State<T>;
export type ComputedResult<T, Args extends any[]> = (...args: Args) => T;
export declare function compute<R, Args extends any[]>(computeFn: (...args: Args) => R): ComputedResult<R, Args>;
export declare function createComputed<C extends Record<string, (...args: any[]) => any>>(computedFn: () => C): ComputedProperties<C>;
