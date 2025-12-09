import { signal } from '@preact/signals-core';
import { html } from 'uhtml/reactive';

export function createRouter(routes) {
    const routeMap = {};
    const compiledRoutes = routes.map(r => {
        if (r.path === "*") {
            routeMap[r.name || "*"] = { ...r, keys: [], regex: null, catchAll: true };
            return { ...r, keys: [], regex: null, catchAll: true };
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
        routeMap[r.name] = { ...r, keys, regex };
        return { ...r, keys, regex };
    });

    const current = signal(parse(location.hash));

    window.addEventListener("hashchange", () => {
        current.value = parse(location.hash);
    });

    function parse(hash) {
        const path = hash.slice(1) || "/";
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
            path = path.replace(":" + key, params[key]);
        }
        return "#" + path;
    }

    function navigate(nameOrPath, params) {
        if (routeMap[nameOrPath]) {
            location.hash = route(nameOrPath, params);
        } else {
            location.hash = nameOrPath;
        }
    }

    function view() {
        const { route, params } = current.value;
        return route.render(params);
    }

    return { current, navigate, view, route };
}
