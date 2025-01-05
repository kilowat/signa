import { createComponentStyles } from "signa/core/component-styles";


export default createComponentStyles('signa-button', `
    :host {
        display: inline-block;
    }
    
    .signa-button {
        background: var(--signa-button-background, #007bff);
        color: var(--signa-button-color, #ffffff);
        padding: var(--signa-button-padding, 8px 16px);
        border-radius: var(--signa-button-radius, 4px);
        border: var(--signa-button-border, none);
        cursor: pointer;
    }

    .signa-button:hover {
        background: var(--signa-button-hover-background, #0056b3);
    }

    /* Variants */
    :host([variant="secondary"]) .signa-button {
        background: var(--signa-button-secondary-background, #6c757d);
    }

    :host([variant="outline"]) .signa-button {
        background: transparent;
        border: 1px solid var(--signa-button-background, #007bff);
        color: var(--signa-button-background, #007bff);
    }
`);
