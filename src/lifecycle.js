let pending = 0;
let readyFired = false;
let readyCallbacks = [];

export function onSignaReady(cb) {
    if (readyFired) {
        cb();
    } else {
        readyCallbacks.push(cb);
    }
}

function fireReady() {
    if (readyFired) return;
    readyFired = true;

    readyCallbacks.forEach(fn => {
        try { fn(); } catch (e) { console.error(e); }
    });
    readyCallbacks = [];

    document.dispatchEvent(new CustomEvent("signa:ready"));
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
