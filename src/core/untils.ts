import { ReadonlySignal, Signal, computed as preactComputed } from '@preact/signals-core';

interface ComputedCache<T> {
    signal: Signal<T>;
    args: unknown[];
    lastAccessed: number;
}

export class ComputedManager {
    private static maxCacheSize = 1000;
    private static cleanupThreshold = 0.8; // 80% of maxCacheSize
    private static cacheTimeout = 5 * 60 * 1000; // 5 minutes

    private static createCacheKey(args: unknown[]): string {
        return args.map(arg => {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            if (typeof arg === 'object') {
                // Try to use id or similar unique identifier first
                const obj = arg as Record<string, unknown>;
                if ('id' in obj) return String(obj.id);
                if ('key' in obj) return String(obj.key);
                // Fall back to stable stringification for objects
                return JSON.stringify(this.sortObjectKeys(obj));
            }
            return String(arg);
        }).join('|');
    }

    private static sortObjectKeys<T extends object>(obj: T): T {
        if (Array.isArray(obj)) {
            return obj.map(item =>
                typeof item === 'object' && item !== null ? this.sortObjectKeys(item) : item
            ) as unknown as T;
        }
        return Object.keys(obj)
            .sort()
            .reduce((acc, key) => {
                const value = obj[key as keyof T];
                (acc as any)[key] = typeof value === 'object' && value !== null
                    ? this.sortObjectKeys(value)
                    : value;
                return acc;
            }, {} as T);
    }

    private static argsEqual(a: unknown[], b: unknown[]): boolean {
        if (a.length !== b.length) return false;
        return a.every((val, i) => {
            if (Object.is(val, b[i])) return true;
            if (typeof val === 'object' && val && typeof b[i] === 'object' && b[i]) {
                return JSON.stringify(this.sortObjectKeys(val as object)) ===
                    JSON.stringify(this.sortObjectKeys(b[i] as object));
            }
            return false;
        });
    }

    public static createComputed<T, Args extends unknown[]>(
        fn: (...args: Args) => T,
        options: {
            maxAge?: number;
            cacheSize?: number;
        } = {}
    ): (...args: Args) => T {
        const cache = new Map<string, ComputedCache<T>>();
        const maxAge = options.maxAge ?? this.cacheTimeout;
        const maxSize = options.cacheSize ?? this.maxCacheSize;

        return (...args: Args): T => {
            // For computed without arguments, we can just create a single signal
            if (args.length === 0) {
                if (!cache.has('_')) {
                    const signal = preactComputed(() => fn(...args));
                    cache.set('_', {
                        signal,
                        args: [],
                        lastAccessed: Date.now()
                    });
                }
                const cached = cache.get('_')!;
                cached.lastAccessed = Date.now();
                return cached.signal.value;
            }

            const cacheKey = this.createCacheKey(args);
            const cached = cache.get(cacheKey);

            // Check cache and args equality
            if (cached && this.argsEqual(cached.args, args)) {
                const now = Date.now();
                if (now - cached.lastAccessed <= maxAge) {
                    cached.lastAccessed = now;
                    return cached.signal.value;
                }
            }

            // Clean up cache if needed
            if (cache.size >= maxSize * this.cleanupThreshold) {
                this.cleanup(cache, maxAge);
            }

            // Create new computed
            const signal = preactComputed(() => fn(...args));
            cache.set(cacheKey, {
                signal,
                args: [...args],
                lastAccessed: Date.now()
            });

            return signal.value;
        };
    }

    private static cleanup<T>(
        cache: Map<string, ComputedCache<T>>,
        maxAge: number
    ): void {
        const now = Date.now();
        for (const [key, value] of cache.entries()) {
            if (now - value.lastAccessed > maxAge) {
                cache.delete(key);
            }
        }
    }
}

export function createComputedProperty<T, Args extends unknown[]>(
    fn: (...args: Args) => T,
    options?: { maxAge?: number; cacheSize?: number }
): (...args: Args) => T {
    return ComputedManager.createComputed(fn, options);
}

export type ComputedProperties<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any
    ? ReadonlySignal<ReturnType<C[K]>>
    : never;
};

export type InferComputedType<T> = T extends (...args: any[]) => any
    ? ReturnType<T>
    : never;