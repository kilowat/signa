import { effect } from '@preact/signals-core';
import { defStore, resolveStore } from './store.js';

defStore('event:bus', ({ signal }) => {
    const lastEvent = signal(null);

    return {
        emit: (type, payload) => {
            lastEvent.value = { type, payload, ts: Date.now() };
        },
        on: (type, handler) => {
            effect(() => {
                const ev = lastEvent.value;
                if (ev && ev.type === type) handler(ev.payload);
            });
        }
    };
});

export const eventBus = resolveStore('event:bus');
