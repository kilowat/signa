# Web Components Framework

A lightweight lib for building reactive web components with signals and template engine.

## Features

- **TypeScript First**: Full type safety with generics support
- **Web Components**: Create custom elements with a simple API
- **Template**: Micro template engine from uhtml
- **Reactive**: Built-in reactivity hooks using signals from prereact
- **Service Locator**: Simple dependency injection
- **Slots**: Native slot system with TypeScript validation
- **Dependencies**:
    - [ @preact/signals-core](https://www.npmjs.com/package/@preact/signals-core) for reactivity
    - [ uhtml](https://github.com/WebReflection/uhtml) for html template
- **Build size**: 20kb minify, 8kb gzib
## Installation

```bash
todo
```
## Quick Start

### IIFE in browsers
```html
<script src="../packages/core/dist/signa.core.min.js"></script>
```
```javascript
const { def, html, htmlFor,useSignal, useComputed, useEffect, app } = window.signa;
```
### ESM 
```html
<script>
    import { def, html, htmlFor,useSignal, useComputed, useEffect, app } from '../packages/core/dist/signa.core.esm.min.js'
</script>
```
### npm to do publish
```typescript
import { def, html, useSignal } from '@signa/core';

def({
  tagName: 'my-counter',
  props: {
    initial: { type: Number, default: 0 }
  },
  setup({ props }) {
    const count = useSignal(props.initial.value);
    
    const increment = () => count.value++;
    
    return { count, increment };
  },
  render() {
    return html`
      <div>
        <p>Count: ${this.count}</p>
        <button onclick=${this.increment}>Increment</button>
      </div>
    `;
  }
});
```

## Usage

### Component Definition

```typescript
def({
  // Component tag name
  tagName: 'my-component',
  
  // Props definition
  props: {
    title: { type: String, default: 'Hello' },
    count: { type: Number },
    isActive: { type: Boolean },
    items: { type: Array },
    json: { type: Object },
  },
  
  // Available slots
  slots: ['header', 'footer'],
  
  // Setup function - returns reactive state and methods
  setup({ props }) {
    // Component logic
    return { /* state and methods */ };
  },
  
  // Lifecycle hooks
  connected() {
    // Called when component is mounted
  },
  
  // Render function
  render() {
    return html`/* template */`;
  },
  
  // Cleanup
  disconnected() {
    // Called when component is removed
  }
});
```

### Service Locator

```typescript
import { app } from '@signa/core';

// Register service
app.register('myService', () => new MyService());

// Get service instance
const service = app.get('myService');
```

### Slots Usage

```html
<my-component>
  <div data-slot="header">Header Content</div>
  <div>Default Slot Content</div>
  <div data-slot="footer">Footer Content</div>
</my-component>
```

### How to use html engine and signal see documentaion on
- [ @preact/signals-core](https://www.npmjs.com/package/@preact/signals-core)
- [ uhtml](https://github.com/WebReflection/uhtml)


## Build Formats

- **ESM**: For modern bundlers and ES modules
- **IIFE**: For direct browser usage

## Browser Support

- All modern browsers supporting Web Components
- Chrome, Firefox, Safari, Edge

## License

MIT
