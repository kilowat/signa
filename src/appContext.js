// appContext.js
const appContext = new Map();

export function provide(key, value) {
    if (appContext.has(key)) {
        console.warn(`Context key "${key}" allready register`);
    }
    appContext.set(key, value);
}

export function inject(key) {
    if (!appContext.has(key)) {
        throw new Error(`Context key "${key}" not found`);
    }
    return appContext.get(key);
}

export function getAppContext() {
    return appContext;
}
