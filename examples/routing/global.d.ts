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
        count: Signal<number>;
        inc: () => void;
        dec: () => void;
    }

    interface UserStore {
        name: Signal<string>;
        email: Signal<string>;
        login: (email: string, password: string) => Promise<void>;
        logout: () => void;
    }

    interface CartStore {
        items: Signal<Array<{ id: string; name: string; price: number }>>;
        total: ReadonlySignal<number>;
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