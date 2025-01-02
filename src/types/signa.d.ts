import { CounterStore } from '../components';

// Используем declare module для добавления/расширения типов
declare module 'sigma' {
    // Расширяем интерфейс GlobalStore
    export interface GlobalStore extends GlobalStore {
        counter: CounterStore
        anotherStore?: StoreContext<any, any, any, any>;
        // Здесь можно добавить сколько угодно новых типов
    }
    export * from '../core';
}