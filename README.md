# Signa

Lightweight wrapper around Web Components, [uhtml](https://github.com/WebReflection/uhtml) and [@preact/signals-core](https://www.npmjs.com/package/@preact/signals-core). Designed for regular HTML and PHP sites — no build step required on the page itself.

**~20kb minified, ~8kb gzip.**

## How it works

One function on `window` — `sig()` — does everything:

```js
sig(id, fn)   // two args → define component or state
sig(id)       // one arg  → get state instance
sig.router()  // create a hash router
```

- `id` contains a hyphen → **component** (`my-cart`, `user-card`)
- `id` is camelCase, `fn` returns an object → **singleton state**
- `id` is camelCase, `fn` returns a function → **composable**

---

## Installation

```bash
npm install
npm run build
```

Then include the bundle on your page:

```html
<script src="/dist/signa.min.js"></script>
```

TypeScript types are available at `dist/signa.d.ts`.

---

## Quick start

```html
<script src="/dist/signa.min.js"></script>

<script>
  sig('my-counter', ({ html, signal }) => {
    const count = signal(0)
    return () => html`
      <div>
        <p>Count: ${count.value}</p>
        <button onclick=${() => count.value++}>+</button>
      </div>
    `
  })
</script>

<my-counter></my-counter>
```

---

## Components

`sig('tag-name', setup)` registers a custom element. The setup function receives a context object and must return a render function.

```js
sig('user-card', ({ html, signal, computed, effect, prop, slot, state, bus, $this }) => {

  // props
  const name  = prop('name', String, 'Anonymous')
  const score = prop('score', Number, 0)

  // local state
  const open = signal(false)

  // computed
  const label = computed(() => open.value ? 'Close' : 'Open')

  // side effect with optional cleanup
  effect(() => {
    console.log('score changed:', score.value)
    return () => console.log('cleanup')
  })

  // render
  return () => html`
    <div>
      <h2>${name.value} — ${score.value} pts</h2>
      <button onclick=${() => open.value = !open.value}>${label.value}</button>
      ${open.value ? html`<div>${slot.default}</div>` : null}
    </div>
  `
})
```

### Context API

| Key | Description |
|---|---|
| `$this` | The HTMLElement instance |
| `html` | uhtml tagged template |
| `signal(val)` | Create reactive value |
| `computed(fn)` | Create derived value |
| `effect(fn)` | Side effect, return fn for cleanup |
| `prop(name, Type?, default?)` | Reactive read-only prop |
| `slot` / `slot('name')` | Access slotted children |
| `state(key)` | Get a state instance |
| `bus` | Event bus |

### Props

Props are **read-only** inside a component. They can be passed as:

**HTML attributes** (from PHP or static HTML):
```html
<user-card data-name="Alex" data-score="42"></user-card>
<!-- kebab-case also works -->
<user-card data-first-name="Alex"></user-card>
```

**JS property** (signal or plain value from a parent component):
```js
// parent passing a signal down
html`<user-card .score=${mySignal}></user-card>`

// parent passing a callback
html`<user-card .onSelect=${(id) => console.log(id)}></user-card>`
```

```js
// child reads it the same way either way
const score    = prop('score', Number, 0)
const onSelect = prop('onSelect')

// onSelect is a function, not a signal
onSelect(item.id)
```

### Slots

```html
<user-card data-name="Alex">
  <div data-slot="footer">Footer content</div>
  <p>Default slot content</p>
</user-card>
```

```js
sig('user-card', ({ html, slot }) => {
  return () => html`
    <div>
      ${slot.default}
      <footer>${slot('footer')}</footer>
    </div>
  `
})
```

---

## State

`sig('key', factory)` registers state. The factory receives `{ signal, computed, effect, state }`.

**Return an object → singleton:**
```js
sig('cartState', ({ signal, computed }) => {
  const items = signal([])
  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0))
  return { items, total }
})
```

**Return a function → composable:**
```js
sig('useCounter', ({ signal }) => (start = 0) => {
  const count = signal(start)
  return { count, inc: () => count.value++ }
})
```

**Get instance anywhere:**
```js
// in a component
const cart = state('cartState')

// on the page (PHP sets initial data)
sig('cartState').items.value = <?= json_encode($cart['items']) ?>
```

**Composable — call the returned function:**
```js
// in a component
const counter = state('useCounter')(10)
counter.inc()
```

**State can use other state:**
```js
sig('orderState', ({ signal, state }) => {
  const cart = state('cartState')
  const submitted = signal(false)

  return {
    submitted,
    submit() {
      if (!cart.items.value.length) return
      submitted.value = true
    }
  }
})
```

---

## PHP integration

State can be seeded from the server by simply writing to it after the bundle loads. `sig(key)` resolves the instance on first call, so you can write before any component mounts.

```html
<script src="/dist/signa.min.js"></script>
<script>
  sig('cartState').items.value = <?= json_encode($cart) ?>
  sig('userState').profile.value = <?= json_encode($user) ?>
</script>

<my-cart></my-cart>
```

Or define state directly on the page before the components mount:

```html
<script>
  sig('pageState', ({ signal }) => {
    const filters = signal(<?= json_encode($filters) ?>)
    return { filters }
  })
</script>
```

---

## Event bus

`bus.on` returns an unsubscribe function. Use it inside `effect` for automatic cleanup.

```js
sig('my-widget', ({ html, bus, effect, signal }) => {
  const message = signal('')

  effect(() => {
    const off = bus.on('chat:message', payload => {
      message.value = payload.text
    })
    return off
  })

  return () => html`<div>${message.value}</div>`
})
```

Emit from anywhere:
```js
sig('send-btn', ({ html, bus }) => {
  return () => html`
    <button onclick=${() => bus.emit('chat:message', { text: 'Hello' })}>
      Send
    </button>
  `
})
```

**Built-in event:**
```js
bus.on('sig:ready', () => {
  // fires after each component finishes mounting
})
```

---

## Router

`sig.router(routes)` returns a router instance. Define it once, share via state.

```js
sig('appRouter', ({html}) => {
  return sig.router([
    { name: 'home',  path: '/',          render: () => html`<h1>Home</h1>` },
    { name: 'user',  path: '/users/:id', render: ({ id }) => html`<h1>User ${id}</h1>` },
    { name: '404',   path: '*',          render: () => html`<h1>Not found</h1>` },
  ])
})
```

```js
sig('app-root', ({ html, state }) => {
  const router = state('appRouter')
  return () => html`
    <nav>
      <a href=${router.route('home')}>Home</a>
      <a href=${router.route('user', { id: 1 })}>User 1</a>
    </nav>
    <main>${router.view()}</main>
  `
})
```

```js
// navigate programmatically
state('appRouter').navigate('user', { id: 42 })
state('appRouter').navigate('/users/42')
```

---

## File structure

```
src/
  index.js      entry — defines sig(), mounts on window
  component.js  custom element factory
  state.js      state registry and resolver
  bus.js        event bus (built-in state)
  router.js     hash router
  signa.d.ts    TypeScript declarations
build.js
```

---

## Browser support

All modern browsers with Web Components support: Chrome, Firefox, Safari, Edge.

---

## License

MIT