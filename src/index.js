
import { defComponent } from './component.js';

import {
    defState,
    resolveState,
} from './state.js';

import { createRouter } from './router.js';
import { location } from './location.js';
import { bus } from './bus.js';

const app = {};

function exposeState(key) {
    Object.defineProperty(app, key, {
        enumerable: true,
        configurable: true,

        get() {
            return resolveState(key);
        },
    });
}

function register(id, factory) {
    if (id.includes('-')) {
        defComponent(id, factory);
        return;
    }

    defState(id, factory);
    exposeState(id);
}

function createAPI() {
    const $$ = function (id, factory) {
        if (factory === undefined) {
            return resolveState(id);
        }

        return register(id, factory);
    };

    $$.router = createRouter;
    $$.location = location;
    $$.bus = bus;
    $$.app = app;

    return $$;
}

export const $$ = createAPI();

window.$$ = $$;

