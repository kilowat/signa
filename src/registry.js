// registry.js
const registry = new Map();

export function provide(key, value) {
    if (registry.has(key)) {
        console.warn(`Context key "${key}" allready register`);
    }
    registry.set(key, value);
}

export function inject(key) {
    if (!registry.has(key)) {
        throw new Error(`Context key "${key}" not found`);
    }
    return registry.get(key);
}

export function getRegistry() {
    return registry;
}
