
class DIContainer {
    private dependencies = new Map<string, any>();

    provide<T>(key: string, value: T) {
        this.dependencies.set(key, value);
    }

    inject<T>(key: string): T {
        const value = this.dependencies.get(key);
        if (!value) {
            throw new Error(`No dependency found for key: ${key}`);
        }
        return value;
    }
}

const container = new DIContainer();

export const app = {
    container,
};
export type App = typeof app;