// mock-api.ts
export type FilterOption = {
    id: string;
    name: string;
    code: string;
    type: 'checkbox' | 'range' | 'select';
    values?: { id: string; value: string; }[];
    range?: { min: number; max: number; };
};

const mockFilters: FilterOption[] = [
    {
        id: '1',
        name: 'Производитель',
        code: 'manufacturer',
        type: 'checkbox',
        values: [
            { id: '1', value: 'Apple' },
            { id: '2', value: 'Samsung' },
            { id: '3', value: 'Xiaomi' }
        ]
    },
    {
        id: '2',
        name: 'Цена',
        code: 'price',
        type: 'range',
        range: { min: 0, max: 150000 }
    },
    {
        id: '3',
        name: 'Цвет',
        code: 'color',
        type: 'select',
        values: [
            { id: '1', value: 'Черный' },
            { id: '2', value: 'Белый' },
            { id: '3', value: 'Красный' }
        ]
    }
];

export const api = {
    async getFilters(): Promise<FilterOption[]> {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockFilters), 300);
        });
    },

    async applyFilter(filters: Record<string, any>): Promise<void> {
        return new Promise(resolve => {
            console.log('Applied filters:', filters);
            setTimeout(resolve, 300);
        });
    }
};