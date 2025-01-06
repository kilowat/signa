
import { defineComponent, html } from 'signa/core';
import { api, FilterOption } from './mock-api';
import filterStyles from './filter.module.scss';


interface FilterState {
    filters: FilterOption[];
    selectedValues: Record<string, any>;
    loading: boolean;
}

export const SmartFilter = defineComponent({
    tagName: 'smart-filter',

    state: {
        filters: [],
        selectedValues: {},
        loading: false
    } as FilterState,

    connected({ state, actions }) {
        actions.loadFilters();
    },

    actions: ({ state }) => ({
        async loadFilters() {
            state.emit({ loading: true });
            const filters = await api.getFilters();
            state.emit({
                filters,
                loading: false,
                selectedValues: filters.reduce((acc, filter) => {
                    if (filter.type === 'range') {
                        acc[filter.code] = { ...filter.range };
                    }
                    return acc;
                }, {} as Record<string, any>)
            });
        },

        updateFilter(code: string, value: any) {
            const newValues = { ...state.peek().selectedValues };

            if (value === undefined) {
                delete newValues[code];
            } else {
                newValues[code] = value;
            }

            state.emit({ selectedValues: newValues });
        },

        async applyFilters() {
            state.emit({ loading: true });
            await api.applyFilter(state.peek().selectedValues);
            state.emit({ loading: false });
        }
    }),

    render: ({ state, actions }) => {
        const { filters, loading } = state.value;

        return html`
            <div class="smart-filter">
                ${renderLoading(loading)}
                <div class="smart-filter__body">
                    ${filters.map(filter => renderFilter(filter, state.value, actions))}
                </div>
                ${renderFooter(loading, actions)}
            </div>
        `;
    }
});

const renderLoading = (loading: boolean) => loading
    ? html`<div class="smart-filter__loading">Loading...</div>`
    : '';

const renderFilter = (
    filter: FilterOption,
    state: FilterState,
    actions: any
) => {
    switch (filter.type) {
        case 'checkbox': return renderCheckboxFilter(filter, state, actions);
        case 'range': return renderRangeFilter(filter, state, actions);
        case 'select': return renderSelectFilter(filter, state, actions);
    }
};

const renderCheckboxFilter = (
    filter: FilterOption,
    state: FilterState,
    actions: any
) => html`
    <div class="smart-filter__group">
        <h3>${filter.name}</h3>
        ${filter.values?.map(value =>
    renderCheckboxOption(filter, value, state.selectedValues, actions)
)}
    </div>
`;

const renderCheckboxOption = (
    filter: FilterOption,
    value: { id: string; value: string },
    selectedValues: Record<string, any>,
    actions: any
) => {
    const isChecked = (selectedValues[filter.code] || []).includes(value.id);

    const handleChange = (e: Event) => {
        const checked = (e.target as HTMLInputElement).checked;
        const current = selectedValues[filter.code] || [];
        actions.updateFilter(
            filter.code,
            checked
                ? [...current, value.id]
                : current.filter((id: string) => id !== value.id)
        );
    };

    return html`
        <label class="smart-filter__checkbox">
            <input 
                type="checkbox"
                .checked=${isChecked}
                @change=${handleChange}
            />
            ${value.value}
        </label>
    `;
};

const renderRangeFilter = (
    filter: FilterOption,
    state: FilterState,
    actions: any
) => {
    const range = state.selectedValues[filter.code] || filter.range;

    const handleMinChange = (e: Event) => {
        const value = +(e.target as HTMLInputElement).value;
        actions.updateFilter(filter.code, {
            ...range,
            min: value
        });
    };

    const handleMaxChange = (e: Event) => {
        const value = +(e.target as HTMLInputElement).value;
        actions.updateFilter(filter.code, {
            ...range,
            max: value
        });
    };

    return html`
        <div class="smart-filter__group">
            <h3>${filter.name}</h3>
            <div class="smart-filter__range">
                <input 
                    type="number"
                    .value=${range?.min}
                    @input=${handleMinChange}
                />
                <span>-</span>
                <input 
                    type="number"
                    .value=${range?.max}
                    @input=${handleMaxChange}
                />
            </div>
        </div>
    `;
};

const renderSelectFilter = (
    filter: FilterOption,
    state: FilterState,
    actions: any
) => {
    const handleChange = (e: Event) => {
        const value = (e.target as HTMLSelectElement).value;
        actions.updateFilter(filter.code, value || undefined);
    };

    return html`
        <div class="smart-filter__group">
            <h3>${filter.name}</h3>
            <select @change=${handleChange}>
                <option value="">Все</option>
                ${filter.values?.map(value =>
        renderSelectOption(filter, value, state.selectedValues)
    )}
            </select>
        </div>
    `;
};

const renderSelectOption = (
    filter: FilterOption,
    value: { id: string; value: string },
    selectedValues: Record<string, any>
) => html`
    <option 
        value=${value.id}
        .selected=${selectedValues[filter.code] === value.id}
    >
        ${value.value}
    </option>
`;

const renderFooter = (loading: boolean, actions: any) => html`
    <div class="smart-filter__footer">
        <button 
            @click=${() => actions.applyFilters()}
            ?disabled=${loading}
        >
            Применить
        </button>
    </div>
`;