declare const counterStore: import("signa/core").StoreContext<{
    count: number;
}, (context: {
    state: import("signa/core").State<{
        count: number;
    }>;
}) => Record<string, (...args: any[]) => any>, (context: {
    state: import("signa/core").State<{
        count: number;
    }>;
}) => Record<string, (...args: any[]) => any>, (context: {
    state: import("signa/core").State<{
        count: number;
    }>;
    computed: import("signa/core").ComputedProperties<Record<string, (...args: any[]) => any>>;
}) => Record<string, (...args: any[]) => any>>;
declare module "signa/core" {
    interface GlobalStore {
        counter: typeof counterStore;
    }
}
export {};
