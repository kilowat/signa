import { signal, effect } from '@preact/signals-core';
import { defStore, resolveStore } from './store.js';


defStore('event:bus', ({ signal }) => {
    const events = signal([]);
    const tick = signal(0);

    return {
        /**
         * Генерация события
         * @param {string} type
         * @param {*} payload
         */
        emit: (type, payload) => {
            events.value = [...events.value, { type, payload, ts: Date.now() }];
            tick.value++;
        },

        /**
         * Подписка на события
         * @param {string} type
         * @param {(payload: any) => void} handler
         * @returns {() => void} unsubscribe
         */
        on: (type, handler) => {
            const e = effect(() => {
                const evs = events.value.filter(ev => ev.type === type);
                if (evs.length) {
                    evs.forEach(ev => handler(ev.payload));
                    events.value = events.value.filter(ev => ev.type !== type);
                }
            });

            return () => e();
        },

    };
});

export const eventBus = resolveStore('event:bus');
