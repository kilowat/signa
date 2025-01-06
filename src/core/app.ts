type Service = any;
type ServiceFactory = (...args: any[]) => Service;

interface ServiceStore {
    [key: string]: {
        factory: ServiceFactory;
        instance?: Service;
    };
}

const createServiceLocator = () => {
    const services: ServiceStore = {};

    const register = (name: string, factory: ServiceFactory) => {
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

    return { register, get, clear };
};



export const app = {
    ...createServiceLocator()
};
export type App = typeof app;