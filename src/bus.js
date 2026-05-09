import { signal, effect } from '@preact/signals-core';
import { defState, resolveState } from './state.js';

defState('__bus__', () => {
    const events = signal([]);

    return {
        emit(type, payload) {
            events.value = [...events.value, { type, payload }];
        },
        on(type, handler) {
            const stop = effect(() => {
                const matched = events.value.filter(e => e.type === type);
                if (matched.length) {
                    matched.forEach(e => handler(e.payload));
                    events.value = events.value.filter(e => e.type !== type);
                }
            });
            return stop;
        },
    };
});

export const bus = resolveState('__bus__');