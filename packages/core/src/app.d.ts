type Service = any;
type ServiceFactory = (...args: any[]) => Service;
export declare const app: {
    register: (name: string, factory: ServiceFactory) => void;
    get: <T>(name: string, ...args: any[]) => T;
    clear: () => void;
};
export type App = typeof app;
export {};
