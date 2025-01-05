import { StyleRegistry } from "./styles-registry";

export interface ThemeConfig {
    [key: string]: string | number | ThemeConfig;
}

export function createComponentStyles(componentName: string, cssTemplate: string, defaultConfig: ThemeConfig = {}) {
    const prefix = `--${componentName}`;

    function configToCssVars(config: ThemeConfig, parentKey: string = ''): string {
        return Object.entries(config).map(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}-${key}` : `${prefix}-${key}`;
            if (typeof value === 'object') {
                return configToCssVars(value as ThemeConfig, fullKey);
            }
            return `${fullKey}: ${value};`;
        }).join('\n');
    }

    const defaultVars = configToCssVars(defaultConfig);
    const componentStyles = `
        :root {
            ${defaultVars}
        }
        ${cssTemplate}
    `;

    StyleRegistry.getInstance().register(componentName, componentStyles);

    return {
        connectComponent(element: HTMLElement) {
            StyleRegistry.getInstance().connectComponent(componentName, element);
        },
        disconnectComponent(element: HTMLElement) {
            StyleRegistry.getInstance().disconnectComponent(componentName, element);
        },
        updateConfig(config: Partial<ThemeConfig>): void {
            const style = document.createElement('style');
            style.textContent = `
                :root {
                    ${configToCssVars(config as any)}
                }
            `;
            document.head.appendChild(style);
        }
    };
}