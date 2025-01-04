import { ReadonlySignal, Signal, signal as createSignal, computed as preactComputed } from '@preact/signals-core';
import { ComputedProperties } from './component';


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

export type ComputedResult<T, Args extends any[]> = (...args: Args) => T;

export function compute<R, Args extends any[]>(
    computeFn: (...args: Args) => R
): ComputedResult<R, Args> {
    return (...args: Args) => {
        const signal = preactComputed(() => computeFn(...args));
        return signal.value;
    };
}


export function createComputed<C extends Record<string, (...args: any[]) => any>>(
    computedFn: () => C
): ComputedProperties<C> {
    const computedSignals = new Map<string, any>();
    const computedCache = new Map<string, Map<string, any>>(); // Кэш для функций с аргументами

    const computed = Object.entries(computedFn()).reduce((acc, [key, fn]) => {
        if (fn.length === 0) {
            // Кэшируем вычисления без аргументов
            if (!computedSignals.has(key)) {
                computedSignals.set(key, preactComputed(() => fn()));
            }
            return {
                ...acc,
                [key]: () => computedSignals.get(key).value,
            };
        }

        // Для функций с аргументами создаём кэш
        return {
            ...acc,
            [key]: (...args: any[]) => {
                const cacheKey = JSON.stringify(args); // Генерация ключа для аргументов
                let argCache = computedCache.get(key);

                if (!argCache) {
                    argCache = new Map<string, any>();
                    computedCache.set(key, argCache);
                }

                if (!argCache.has(cacheKey)) {
                    const signal = preactComputed(() => fn(...args));
                    argCache.set(cacheKey, signal);
                }

                return argCache.get(cacheKey).value;
            },
        };
    }, {} as ComputedProperties<C>);

    return computed;
}
