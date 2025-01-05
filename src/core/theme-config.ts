import { StyleRegistry } from './styles-registry';

export interface ThemeTokens {
    colors: {
        primary: string;
        secondary: string;
        text: string;
        background: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    radius: {
        sm: string;
        md: string;
        lg: string;
    };
}

export class ThemeProvider {
    private static instance: ThemeProvider;
    private tokens: Partial<ThemeTokens>;

    private constructor() {
        this.tokens = {};
    }

    static getInstance(): ThemeProvider {
        if (!ThemeProvider.instance) {
            ThemeProvider.instance = new ThemeProvider();
        }
        return ThemeProvider.instance;
    }

    setTokens(tokens: Partial<ThemeTokens>): void {
        this.tokens = { ...this.tokens, ...tokens };
        this.updateStyles();
    }

    private updateStyles(): void {
        const css = this.tokensToCss(this.tokens);
        StyleRegistry.getInstance().register('theme-tokens', css);
    }

    private tokensToCss(tokens: Partial<ThemeTokens>, prefix = ''): string {
        const vars: string[] = [];

        Object.entries(tokens).forEach(([key, value]) => {
            if (typeof value === 'object') {
                vars.push(this.tokensToCss(value as any, `${prefix}${key}-`));
            } else {
                vars.push(`--signa-${prefix}${key}: ${value};`);
            }
        });

        return vars.join('\n');
    }
}

// Пример использования в приложении:
export function initializeTheme(config: Partial<ThemeTokens> = {}) {
    const defaultTokens: ThemeTokens = {
        colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            text: '#212529',
            background: '#ffffff'
        },
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px'
        },
        radius: {
            sm: '4px',
            md: '8px',
            lg: '16px'
        }
    };

    ThemeProvider.getInstance().setTokens({
        ...defaultTokens,
        ...config
    });
}