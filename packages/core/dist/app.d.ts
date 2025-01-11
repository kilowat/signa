type Service<T = unknown> = T;
type ServiceFactory<T = unknown> = (...args: any[]) => Service<T>;
export declare const app: {
    register: (name: string, factory: ServiceFactory) => void;
    get: <T>(name: string, ...args: any[]) => T;
    clear: () => void;
    clearService: (name: string) => void;
};
export type App = typeof app;
export {};
