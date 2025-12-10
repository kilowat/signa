//lifecyclejs
import { eventBus } from "./eventBus";

let pending = 0;
let readyFired = false;

function fireReady() {
    if (readyFired) return;
    readyFired = true;

    eventBus.emit('components:ready');
}

export function componentStart() {
    pending++;
}

export function componentRendered() {
    pending--;
    if (pending === 0) {
        queueMicrotask(() => {
            if (pending === 0) fireReady();
        });
    }
}
