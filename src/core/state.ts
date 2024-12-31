import { Signal, signal as createSignal, computed as preactComputed } from '@preact/signals-core';



export class State<T> extends Signal<T> {
    emit(value: Partial<T> | T): void {
        if (typeof value === 'object' && value !== null && typeof this.value === 'object') {
            const currentClone = cloneDeep(this.value);
            this.value = { ...currentClone, ...value } as T;
        } else {
            this.value = value as T;
        }
    }
}

export function createState<T>(initialValue: T): State<T> {
    const baseSignal = createSignal(initialValue);
    Object.setPrototypeOf(baseSignal, State.prototype);
    return baseSignal as State<T>;
}


function cloneDeep<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(cloneDeep) as unknown as T;
    }

    const clonedObj: Record<PropertyKey, any> = {};
    for (const key of Reflect.ownKeys(obj)) {
        clonedObj[key as keyof typeof obj] = cloneDeep((obj as Record<PropertyKey, any>)[key]);
    }

    return clonedObj as T;
}
//const computedSignal = preactComputed(() => computeFn(signal.value));
/*
export function compute<S, R>(
    signal: Signal<S>,
    computeFn: (state: S) => R
): ComputedResult<R> {
    const computedSignal = preactComputed(() => computeFn(signal.value));

    const result = {
        get value() {
            return computedSignal.value;
        },
        valueOf() {
            return computedSignal.value;
        },
        toString() {
            return String(computedSignal.value);
        }
    };

    return result;
}
    */