import { Signal, signal as createSignal, computed as preactComputed } from '@preact/signals-core';

export interface State<T> {
    value: T;
    emit(value: Partial<T> | T): void;
    peek(): T;
    subscribe(fn: () => void): () => void;
}

class StateSignal<T> extends Signal<T> implements State<T> {
    emit(value: Partial<T> | T): void {
        if (typeof value === 'object' && value !== null && typeof this.value === 'object') {
            const currentClone = cloneDeep(this.value);
            this.value = { ...currentClone, ...value } as T;
        } else {
            this.value = value as T;
        }
    }
}

export function useState<T>(initialValue: T): State<T> {
    const baseSignal = createSignal(initialValue);
    Object.setPrototypeOf(baseSignal, StateSignal.prototype);
    return baseSignal as StateSignal<T>;
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

export function computed<T>(fn: () => T) {
    return preactComputed<T>(fn);
}