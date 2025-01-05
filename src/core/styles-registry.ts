export class StyleRegistry {
    private static instance: StyleRegistry;
    private styles: Map<string, string> = new Map();
    private componentInstances: Map<string, Set<HTMLElement>> = new Map();
    private styleElements: Map<string, HTMLStyleElement> = new Map();

    private constructor() { }

    static getInstance(): StyleRegistry {
        if (!StyleRegistry.instance) {
            StyleRegistry.instance = new StyleRegistry();
        }
        return StyleRegistry.instance;
    }

    register(componentName: string, css: string): void {
        if (!this.styles.has(componentName)) {
            this.styles.set(componentName, css);
        }
    }

    connectComponent(componentName: string, element: HTMLElement): void {
        if (!this.componentInstances.has(componentName)) {
            this.componentInstances.set(componentName, new Set());
        }

        const instances = this.componentInstances.get(componentName)!;
        instances.add(element);

        // Если это первый экземпляр компонента, добавляем стили
        if (instances.size === 1) {
            this.injectStyles(componentName);
        }
    }

    disconnectComponent(componentName: string, element: HTMLElement): void {
        const instances = this.componentInstances.get(componentName);
        if (!instances) return;

        instances.delete(element);

        // Если больше нет экземпляров компонента, удаляем стили
        if (instances.size === 0) {
            this.removeStyles(componentName);
        }
    }

    private injectStyles(componentName: string): void {
        const css = this.styles.get(componentName);
        if (!css) return;

        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-component', componentName);
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
        this.styleElements.set(componentName, styleElement);
    }

    private removeStyles(componentName: string): void {
        const styleElement = this.styleElements.get(componentName);
        if (styleElement && document.head.contains(styleElement)) {
            document.head.removeChild(styleElement);
            this.styleElements.delete(componentName);
        }
    }
}
