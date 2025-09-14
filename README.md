# Web Components Framework

A lightweight lib for building reactive web components with signals and template engine.

## Features

- **Web Components**: Create custom elements with a simple API
- **Template**: Micro template engine from uhtml
- **Reactive**: Built-in reactivity using @preact/signals-core
- **Store**: Simple state management with signals
- **Dependencies**:
    - [@preact/signals-core](https://www.npmjs.com/package/@preact/signals-core) for reactivity
    - [uhtml](https://github.com/WebReflection/uhtml) for html template
- **Build size**: 20kb minify, 8kb gzib

## Installation

```bash
todo
```

## Quick Start

### IIFE in browsers
```html
<script src="../dist/signa.min.js"></script>
```
```javascript
const { defComponent, defStore, eventBus} = window.signa;
```


### Component Example
```typescript

defComponent('my-counter', (ctx) => {
    const count = ctx.signal(0);
    
    return () => ctx.html`
        <div>
            <p>Count: ${count.value}</p>
            <button onclick=${() => count.value++}>Increment</button>
        </div>
    `;
});
```

## Usage

### Component Definition

Components are defined using the `defComponent` function that takes a tag name and a setup function:

```typescript
defComponent('my-component', (ctx) => {
    // Component Context provides:
    const {
        $this,        // Created component context
        signal,       // Create reactive state
        effect,       // Create side effects
        computed,     // Create computed values
        html,         // Template engine
        htmlFor,      // Template with keys
        prop,         // Define props
        slot         // Access slots
        store     // Get store instance by key
    } = ctx;

    // Define props
    const title = prop({ 
        name: 'title',
        type: String,
        default: 'Hello',
        readonly: false,
    });
    
    // Use slots
    const headerContent = slot('header');
    
    // Create state
    const count = signal(0);
    
    // Create computed
    const doubleCount = computed(() => count.value * 2);
    
    //Create effect

    // Watch to count.value changed
    effect(() => {
        console.log('Count changed:', count.value);
    });

    effect(() => {
        //UnMounted
        return () => { console.log('Component disconnected from dom') }
    })

    // Return render function
    return () => html`
        <div>
            <div>${headerContent}</div>
            <h1>${title.value}</h1>
            <p>Count: ${count.value}</p>
            <p>Double: ${doubleCount.value}</p>
            <button onclick=${() => count.value++}>
                Increment
            </button>
        </div>
    `;
});

```

### Props Types

Props can be defined with the following types.

```typescript
const myProp = prop({
    name: 'myProp', // this name in html data-myProp
    type: String | Number | Boolean | Array | Object | Function,
    default: 'default value',
    readonly: false,
});
return html`<div>${myProp.value}</div>`
//in component pass signal as prop value to child
return html`<my-component .count="${count}"></my-component>`
// as function
const onPressButton = prop({
    name: 'onPressButon',
    type: Function,
    default: 'default value',
});

return html`<my-component .onPressButton="${() => console.log('onPress')}"></my-component>`
```
#### In html use as initional value from php render
<my-component data-count="10"></my-component>
<my-component data-array="[1,2,3]"></my-component>
### Slots Usage

```html
<my-component>
    <div data-slot="header">Header Content</div>
    <div>Default Slot Content</div>
</my-component>
```

In component:
```typescript
const headerSlot = slot('header');     // Get named slot
const defaultContent = slot.default;    // Get default slot
```

### Store Usage

The framework provides a simple store mechanism for state management across components:

```typescript
// Create and register a store
defStore('userStore', (ctx) => {
    const name = ctx.signal('');
    const age = ctx.signal(0);

    const displayName = ctx.computed(() => `User: ${name.value}`);

    return {
        name,
        age,
        displayName
    };
});


// Use store in components
defComponent('user-profile', (ctx) => {
    const userStore = ctx.store('userStore');
    
    return () => ctx.html`
        <div>
            <input 
                value=${userStore.name.value} 
                onInput=${(e) => userStore.name.value = e.target.value}
            />
            <div>${userStore.displayName.value}</div>
        </div>
    `;
});
```



### EventBus Usage

Events communication:

```typescript
const { eventBus } = window.signa;
eventBus.on('my-event:update', (payload)=>{ console.log(payoload) });
eventBus.emit('my-event:update', {value: 1});
```

### Template Engine

The framework uses uhtml for templating. For detailed templating features see:
- [uhtml documentation](https://github.com/WebReflection/uhtml)

### Reactivity

Reactivity is based on @preact/signals-core. For detailed signal features see:
- [@preact/signals-core documentation](https://www.npmjs.com/package/@preact/signals-core)

## Browser Support

- All modern browsers supporting Web Components
- Chrome, Firefox, Safari, Edge

## License

MIT