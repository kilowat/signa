declare global {
    interface User {
        name: string;
        age: number;
    }

    interface Product {
        id: string;
        title: string;
    }

    interface Order {
        id: string;
        userId: string;
    }
    interface CounterStore {
        count: Signa.Signal<number>;
        inc: () => void;
        dec: () => void;
    }

    interface UserStore {
        name: Signa.Signal<string>;
        email: Signa.Signal<string>;
        login: (email: string, password: string) => Promise<void>;
        logout: () => void;
    }

    interface CartStore {
        items: Signa.Signal<Array<{ id: string; name: string; price: number }>>;
        total: Signa.ReadonlySignal<number>;
        addItem: (item: any) => void;
        removeItem: (id: string) => void;
        clear: () => void;
    }

    interface StoreRegistry {
        'counterStore': CounterStore;
        'userStore': UserStore;
        'cartStore': CartStore;
    }
}

export { };