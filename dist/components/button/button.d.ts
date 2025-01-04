import { State } from "signa/core";
declare const counterStore: import("signa/core").StoreContext<{
    count: number;
}, (context: {
    state: State<{
        count: number;
    }>;
}) => Record<string, (...args: any[]) => any>, (context: {
    state: State<{
        count: number;
    }>;
}) => {
    double: () => boolean;
}, (context: {
    state: State<{
        count: number;
    }>;
    computed: import("signa/core").ComputedProperties<{
        double: () => boolean;
    }>;
}) => Record<string, (...args: any[]) => any>>;
declare module "signa/core" {
    interface GlobalStore {
        counter: typeof counterStore;
    }
}
export {};
