type Service<T = unknown> = T;
type ServiceFactory<T = unknown> = (...args: any[]) => Service<T>;

interface ServiceStore {
    [key: string]: {
        factory: ServiceFactory;
        instance?: Service;
    };
}

const createServiceLocator = () => {
    const services: ServiceStore = {};

    const register = (name: string, factory: ServiceFactory) => {
        if (services[name]) {
            throw new Error(`Service ${name} already registered`);
        }
        if (!name.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) {
            throw new Error(`Invalid service name: ${name}`);
        }
        services[name] = { factory };
    };

    const get = <T>(name: string, ...args: any[]): T => {
        const service = services[name];
        if (!service) {
            throw new Error(`Service ${name} not found`);
        }

        if (!service.instance) {
            service.instance = service.factory(...args);
        }

        return service.instance as T;
    };

    const clear = () => {
        Object.keys(services).forEach(key => {
            delete services[key];
        });
    };

    const clearService = (name: string) => {
        if (services[name]) {
            delete services[name];
        }
    };

    return { register, get, clear, clearService };
};

export const app = {
    ...createServiceLocator()
};
export type App = typeof app;