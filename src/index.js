import { defComponent } from './component.js';
import { defState, resolveState } from './state.js';
import { createRouter } from './router.js';
import { bus } from './bus.js';

function $$(id, factory) {
    if (factory === undefined) {
        return resolveState(id);
    }
    if (id.includes('-')) {
        defComponent(id, factory);
    } else {
        defState(id, factory);
    }
}

$$.router = createRouter;
$$.bus = bus;

window.$$ = $$;