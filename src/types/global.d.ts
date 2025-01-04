declare global {
    interface Window {
        Signa: {
            defineComponent: typeof defineComponent;
        };
    }
}