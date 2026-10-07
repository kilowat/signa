import { signal, computed } from '@preact/signals-core';

function parseQuery(search = window.location.search) {
    const result = {};
    const params = new URLSearchParams(search);

    for (const [rawKey, value] of params) {
        const isArray = rawKey.endsWith('[]');
        const key = isArray ? rawKey.slice(0, -2) : rawKey;

        if (isArray) {
            (result[key] ??= []).push(value);
        } else {
            result[key] = value;
        }
    }

    return result;
}

function stringifyQuery(query) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value == null) continue;

        if (Array.isArray(value)) {
            for (const item of value) {
                if (item != null) {
                    params.append(`${key}[]`, item);
                }
            }
        } else {
            params.set(key, value);
        }
    }

    return params.toString();
}

function getPath() {
    return window.location.pathname || '/';
}

function getUrl() {
    return getPath() + window.location.search + window.location.hash;
}

const current = signal({
    url: getUrl(),
    path: getPath(),
    query: parseQuery(),
});

const query = computed(() => current.value.query);

function sync() {
    current.value = {
        url: getUrl(),
        path: getPath(),
        query: parseQuery(),
    };
}

function update(url, replace = true) {
    history[replace ? 'replaceState' : 'pushState'](
        null,
        '',
        url
    );

    sync();

    return url;
}

export const location = {
    current,
    query,

    url(value) {
        if (value === undefined) {
            return getUrl();
        }

        return update(value);
    },

    path(value) {
        if (value === undefined) {
            return getPath();
        }

        const search = stringifyQuery(current.value.query);

        return update(
            value + (search ? `?${search}` : '')
        );
    },

    get(key) {
        return current.value.query[key];
    },

    getAll() {
        return current.value.query;
    },

    set(values, value) {
        const next = {
            ...current.value.query,
        };

        if (typeof values === 'string') {
            values = {
                [values]: value,
            };
        }

        for (const [key, value] of Object.entries(values)) {
            if (value === null) {
                delete next[key];
            } else {
                next[key] = value;
            }
        }

        const search = stringifyQuery(next);

        return update(
            getPath() + (search ? `?${search}` : '')
        );
    },

    go(value) {
        window.location.href = value ?? getUrl();
    },

    replace(value) {
        return update(value ?? getUrl());
    },

    back() {
        window.history.back();
    },

    forward() {
        window.history.forward();
    },
};

window.addEventListener('popstate', sync);
window.addEventListener('hashchange', sync);