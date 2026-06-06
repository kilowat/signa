const listeners = new Map();

const getOrCreate = type => {
    if (!listeners.has(type)) listeners.set(type, new Set());
    return listeners.get(type);
};

export const bus = {
    emit(type, payload) {
        listeners.get(type)?.forEach(fn => fn(payload));
    },
    on(type, handler) {
        const set = getOrCreate(type);
        set.add(handler);
        return () => set.delete(handler);
    },
};