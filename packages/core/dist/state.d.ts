export { effect, computed, batch, untracked } from '@preact/signals-core';
import { Signal, signal as baseSignal } from '@preact/signals-core';
declare module '@preact/signals-core' {
    interface Signal<T> {
        valueCopy(value: Partial<T>): T;
    }
}
export { Signal, baseSignal as signal };
