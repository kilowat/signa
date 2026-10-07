import { signal } from '@preact/signals-core';
import { html } from 'uhtml/reactive';

export function createRouter(routes, { mode = 'hash' } = {}) {
    const routeMap = {};

    const compiledRoutes = routes.map(r => {
        if (r.path === '*') {
            const entry = {
                ...r,
                keys: [],
                regex: null,
                catchAll: true,
            };

            routeMap[r.name || '*'] = entry;

            return entry;
        }

        const keys = [];

        const regex = new RegExp(
            '^' +
            r.path.replace(
                /:([^/]+)/g,
                (_, k) => {
                    keys.push(k);
                    return '([^/]+)';
                }
            ) +
            '$'
        );

        const entry = {
            ...r,
            keys,
            regex,
        };

        routeMap[r.name] = entry;

        return entry;
    });

    function getPath() {
        return mode === 'hash'
            ? window.location.hash.slice(1) || '/'
            : window.location.pathname || '/';
    }

    function parse(path) {
        path = path || '/';

        for (const route of compiledRoutes) {
            if (route.catchAll) continue;

            const match = path.match(route.regex);

            if (!match) continue;

            const params = {};

            route.keys.forEach((key, index) => {
                params[key] = decodeURIComponent(
                    match[index + 1]
                );
            });

            return {
                path,
                route,
                params,
            };
        }

        const notFound = compiledRoutes.find(
            route => route.catchAll
        );

        return {
            path,
            route: notFound || {
                render: () => html`404`,
            },
            params: {},
        };
    }

    const current = signal(
        parse(getPath())
    );

    function sync() {
        current.value = parse(getPath());
    }

    // Нативные изменения URL браузером
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);

    // pushState / replaceState сами по себе
    // не вызывают popstate, поэтому отслеживаем их тоже.
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function (...args) {
        const result = pushState.apply(this, args);
        sync();
        return result;
    };

    history.replaceState = function (...args) {
        const result = replaceState.apply(this, args);
        sync();
        return result;
    };

    function route(name, params = {}) {
        const r = routeMap[name];

        if (!r) {
            throw new Error(
                `Route "${name}" not found`
            );
        }

        let path = r.path;

        for (const key of r.keys) {
            if (!(key in params)) {
                throw new Error(
                    `Missing param "${key}" for route "${name}"`
                );
            }

            path = path.replace(
                ':' + key,
                encodeURIComponent(params[key])
            );
        }

        return mode === 'hash'
            ? '#' + path
            : path;
    }

    function go(nameOrPath, params) {
        if (routeMap[nameOrPath]) {
            const href = route(
                nameOrPath,
                params
            );

            if (mode === 'hash') {
                window.location.hash = href.slice(1);
            } else {
                history.pushState(
                    null,
                    '',
                    href
                );
            }

            return href;
        }

        if (mode === 'hash') {
            window.location.hash = nameOrPath;
        } else {
            history.pushState(
                null,
                '',
                nameOrPath
            );
        }

        return nameOrPath;
    }

    function view() {
        const { route, params } = current.value;

        return route.render(params);
    }

    return {
        current,
        go,
        view,
        route,
    };
}