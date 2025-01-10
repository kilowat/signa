
export { effect, computed, batch, untracked } from '@preact/signals-core';

import { Signal, signal as baseSignal } from '@preact/signals-core';


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

declare module '@preact/signals-core' {
    interface Signal<T> {
        valueCopy(value: Partial<T>): T;
    }
}

Signal.prototype.valueCopy = function <T>(this: Signal<T>, value: Partial<T>): T {
    if (typeof value === 'object' && value !== null && typeof this.peek() === 'object') {
        const currentClone = cloneDeep(this.peek());
        this.value = { ...currentClone, ...value } as T;
    } else {
        this.value = value as T;
    }
    return this.peek();
};

export { Signal, baseSignal as signal };