import { defComponent } from './component.js';
import { defState, resolveState } from './state.js';
import { createRouter } from './router.js';
import './bus.js';

function sig(id, factory) {
    if (factory === undefined) {
        return resolveState(id);
    }
    if (id.includes('-')) {
        defComponent(id, factory);
    } else {
        defState(id, factory);
    }
}

sig.router = createRouter;

window.sig = sig;