import { signal, computed } from '@preact/signals-core';
import { html, htmlFor } from 'uhtml/reactive';
import { resolveStore } from './store.js'; // если у тебя есть

export function createRouter(setup) {
    // Собираем ctx, похожий на defComponent
    const ctx = {
        signal,
        computed,
        html,
        htmlFor,
        store: key => resolveStore(key),
    };

    // routes описываются внутри setup, с доступом к ctx
    const routes = setup(ctx);

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
            route: notFound || { render: () => ctx.html`404` },
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

    function View() {
        const { route, params } = current.value;
        return route.render({ ...ctx, ...params });
    }

    return { current, navigate, View, route };
}
