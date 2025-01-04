// types.ts
interface RangeSliderState {
    values: number[];
    isDragging: boolean;
    activeDot: number | null;
}

interface RangeSliderProps {
    min: number;
    max: number;
    step: number;
    values: number[];
    disabled: boolean;
    range: boolean; // true for dual thumbs, false for single thumb
}

// components/range-slider.ts
import { defineComponent, html } from 'signa/core';

defineComponent({
    tagName: 'range-slider',
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        step: {
            type: Number,
            default: 1
        },
        values: {
            type: Array,
            default: [0]
        },
        disabled: {
            type: Boolean,
            default: false
        },
        range: {
            type: Boolean,
            default: false
        }
    },
    stateValue: {
        values: [0],
        isDragging: false,
        activeDot: null
    } as RangeSliderState,
    computed: ({ state, props }) => ({
        positions: () => {
            return state.value.values.map(value => {
                const percent = ((value - props.min) / (props.max - props.min)) * 100;
                return Math.min(Math.max(0, percent), 100);
            });
        },
        trackStyle: () => {
            const positions = state.value.values.sort((a, b) => a - b);
            const leftPos = ((positions[0] - props.min) / (props.max - props.min)) * 100;
            const rightPos = positions[1]
                ? ((positions[1] - props.min) / (props.max - props.min)) * 100
                : 100;
            return `left: ${leftPos}%; right: ${100 - rightPos}%;`;
        }
    }),
    actions: ({ state, props, el }) => ({
        updateValue(clientX: number) {
            const rect = el.getBoundingClientRect();
            const percent = (clientX - rect.left) / rect.width;
            const rawValue = props.min + (props.max - props.min) * percent;
            const steppedValue = Math.round(rawValue / props.step) * props.step;
            const clampedValue = Math.min(Math.max(props.min, steppedValue), props.max);

            if (state.value.activeDot !== null) {
                const newValues = [...state.value.values];
                newValues[state.value.activeDot] = clampedValue;
                state.emit({ values: newValues });
                el.emitEvent('change', { values: newValues });
            }
        },
        onDotMouseDown(index: number, event: MouseEvent) {
            if (props.disabled) return;
            event.preventDefault();
            state.emit({ isDragging: true, activeDot: index });

            const onMouseMove = (e: MouseEvent) => {
                this.updateValue(e.clientX);
            };

            const onMouseUp = () => {
                state.emit({ isDragging: false, activeDot: null });
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        },
        onTrackClick(event: MouseEvent) {
            if (props.disabled) return;
            const rect = el.getBoundingClientRect();
            const clickPosition = (event.clientX - rect.left) / rect.width;
            const clickValue = props.min + (props.max - props.min) * clickPosition;

            // For range slider, find closest dot
            if (props.range && state.value.values.length > 1) {
                const distances = state.value.values.map(value => Math.abs(value - clickValue));
                const closestIndex = distances.indexOf(Math.min(...distances));
                state.emit({ activeDot: closestIndex });
                this.updateValue(event.clientX);
            } else {
                state.emit({ activeDot: 0 });
                this.updateValue(event.clientX);
            }
        }
    }),
    connected({ props, state }) {
        // Initialize values based on props
        state.emit({
            values: props.range ? [props.min, props.max] : [props.min]
        });
    },
    render: ({ props, state, computed, actions }) => html`
        <div class="slider-container" style="position: relative; width: 100%; height: 40px;">
            <div class="slider-track" 
                @click=${actions.onTrackClick}
            >
                <div class="slider-track-fill"
                ></div>
            </div>
            ${state.value.values.map((value, index) => html`
                <div class="slider-dot"
                    @mousedown=${(e: MouseEvent) => actions.onDotMouseDown(index, e)}
                ></div>
            `)}
        </div>
    `
});

// Example parent component usage
export default defineComponent({
    tagName: 'price-filter',
    stateValue: {
        minPrice: 0,
        maxPrice: 1000
    },
    computed: ({ state }) => ({
        formattedRange: () => `$${state.value.minPrice} - $${state.value.maxPrice}`
    }),
    actions: ({ state }) => ({
        updatePriceRange: (event: CustomEvent) => {
            const [min, max] = event.detail.values;
            state.emit({
                minPrice: min,
                maxPrice: max
            });
        }
    }),
    render: ({ state, computed, actions }) => html`
        <div>
            <h3>Price Range</h3>
            <p>${computed.formattedRange.value}</p>
            <range-slider
                data-min="0"
                data-max="1000"
                data-step="10"
                data-range="true"
                data-values="${JSON.stringify([state.value.minPrice, state.value.maxPrice])}"
                @change=${actions.updatePriceRange}
            ></range-slider>
        </div>
    `
});