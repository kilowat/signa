import { signal } from '@preact/signals-core';
import { html } from 'uhtml/reactive';

export function createRouter(routes, { mode = 'hash' } = {}) {
    const routeMap = {};
    const compiledRoutes = routes.map(r => {
        if (r.path === "*") {
            const entry = { ...r, keys: [], regex: null, catchAll: true };
            routeMap[r.name || "*"] = entry;
            return entry;
        }
        const keys = [];
        const regex = new RegExp(
            "^" +
            r.path.replace(/:([^/]+)/g, (_, k) => {
                keys.push(k);
                return "([^/]+)";
            }) +
            "$"
        );
        const entry = { ...r, keys, regex };
        routeMap[r.name] = entry;
        return entry;
    });

    const adapter = {
        getPath() {
            return mode === 'hash'
                ? location.hash.slice(1) || '/'
                : location.pathname || '/';
        },
        push(path) {
            if (mode === 'hash') {
                location.hash = path;
            } else {
                history.pushState(null, '', path);
                current.value = parse(path);
            }
        },
        listen(cb) {
            if (mode === 'hash') {
                window.addEventListener('hashchange', cb);
                return () => window.removeEventListener('hashchange', cb);
            } else {
                window.addEventListener('popstate', cb);
                return () => window.removeEventListener('popstate', cb);
            }
        }
    };

    const current = signal(parse(adapter.getPath()));

    adapter.listen(() => {
        current.value = parse(adapter.getPath());
    });

    function parse(path) {
        path = path || '/';
        for (const route of compiledRoutes) {
            if (route.catchAll) continue;
            const match = path.match(route.regex);
            if (match) {
                const params = {};
                route.keys.forEach((k, i) => (params[k] = match[i + 1]));
                return { path, route, params };
            }
        }
        const notFound = compiledRoutes.find(r => r.catchAll);
        return {
            path,
            route: notFound || { render: () => html`404` },
            params: {}
        };
    }

    function route(name, params = {}) {
        const r = routeMap[name];
        if (!r) throw new Error(`Route "${name}" not found`);
        let path = r.path;
        for (const key of r.keys) {
            if (!(key in params)) throw new Error(`Missing param "${key}" for route "${name}"`);
            path = path.replace(':' + key, params[key]);
        }
        return mode === 'hash' ? '#' + path : path;
    }

    function navigate(nameOrPath, params) {
        const path = routeMap[nameOrPath]
            ? (mode === 'hash' ? '' : '') + routeMap[nameOrPath].path.replace(
                /:([^/]+)/g,
                (_, k) => params?.[k] ?? `:${k}`
            )
            : nameOrPath;

        adapter.push(path.startsWith('#') ? path.slice(1) : path);
    }

    function view() {
        const { route, params } = current.value;
        return route.render(params);
    }

    return { current, navigate, view, route };
}