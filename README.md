# Signa

Lightweight wrapper around [uhtml](https://github.com/WebReflection/uhtml) and [@preact/signals-core](https://www.npmjs.com/package/@preact/signals-core). Designed for regular HTML and PHP sites — no build step required on the page itself.

**~20kb minified, ~8kb gzip.**

## How it works

One function on `window` — `$$()` — does everything:

```js
$$(id, fn)  // two args → define component or state
$$(id)      // one arg  → get state instance
$$.router() // create a router
$$.location // reactive browser location
```

- `id` contains `-` → **component** (`my-cart`, `user-card`)
- `id`, `fn` returns an object → **singleton state**
- `id`, `fn` returns a function → **composable**

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
$$('my-counter', ({ html, signal }) => {
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

`$$('tag-name', setup)` registers a custom element. The setup function receives a context object and must return a render function.

```js
$$('user-card', ({
    html,
    signal,
    computed,
    effect,
    prop,
    slot,
    bus,
    location,
    $this
}) => {

    const name = prop('name', String, 'Anonymous')
    const score = prop('score', Number, 0)

    const open = signal(false)

    const label = computed(() =>
        open.value ? 'Close' : 'Open'
    )

    effect(() => {
        console.log('score changed:', score.value)

        return () => {
            console.log('cleanup')
        }
    })

    return () => html`
        <div>
            <h2>
                ${name.value} — ${score.value} pts
            </h2>

            <button
                onclick=${() => open.value = !open.value}
            >
                ${label.value}
            </button>

            ${open.value
                ? html`<div>${slot.default}</div>`
                : null}
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
| `bus` | Event bus |
| `location` | reactive location util |
### Props

Props are **read-only** inside a component.

They can be passed as HTML attributes:

```html
<user-card
    data-name="Alex"
    data-score="42"
></user-card>
```

Kebab-case also works:

```html
<user-card data-first-name="Alex"></user-card>
```

Or as JavaScript properties:

```js
html`
    <user-card .score=${mySignal}></user-card>
`
```

```js
html`
    <user-card
        .onSelect=${id => console.log(id)}
    ></user-card>
`
```

The child reads them the same way:

```js
const short = prop('short')

const score = prop(
    'score',
    Number,
    0
)

const onSelect = prop('onSelect')

// onSelect is a function, not a signal
onSelect(item.id)
```

### Slots

```html
<user-card data-name="Alex">

    <div data-slot="footer">
        Footer content
    </div>

    <p>
        Default slot content
    </p>

</user-card>
```

```js
$$('user-card', ({ html, slot }) => {

    return () => html`
        <div>
            ${slot.default}

            <footer>
                ${slot('footer')}
            </footer>
        </div>
    `
})
```

---

## State

`$$('key', factory)` registers state.

The factory receives:

```js
{
    signal,
    computed,
    effect
}
```

### Return an object → singleton

```js
$$('cartState', ({ signal, computed }) => {

    const items = signal([])

    const total = computed(() =>
        items.value.reduce(
            (sum, item) => sum + item.price,
            0
        )
    )

    return {
        items,
        total
    }
})
```

### Return a function → composable

```js
$$('useCounter', ({ signal }) => start => {

    const count = signal(start)

    return {
        count,
        inc: () => count.value++
    }
})
```

### Get instance anywhere with `$$()`

```js
const cart = $$('cartState')
```
or use desctructor second arg

```js
$$('useCounter', ({ signal }, { cartState }) => start => {

    const count = signal(start)

    return {
        count,
        inc: () => count.value++
    }
})
```

State can also be initialized directly from PHP:

```html
<script>
$$('cartState').items.value =
    <?= json_encode($cart['items']) ?>
</script>
```

### Composable

```js
const counter = $$('useCounter')(10)

counter.inc()
```

### State can use other state

```js
$$('orderState', ({ signal }) => {

    const submitted = signal(false)

    return {
        submitted,

        submit() {
            const cart = $$('cartState')

            if (!cart.items.value.length) {
                return
            }

            submitted.value = true
        }
    }
})
```

---

## PHP integration

State can be seeded from the server by writing to it after the bundle loads.

`$$(key)` resolves the state instance on first call, so it can be initialized before any component mounts.

```html
<script src="/dist/signa.min.js"></script>

<script>
$$('cartState').items.value =
    <?= json_encode($cart['items']) ?>

$$('userState').profile.value =
    <?= json_encode($user) ?>
</script>

<my-cart></my-cart>
```

Or define state directly on the page before the components mount:

```html
<script>
$$('pageState', ({ signal }) => {

    const filters = signal(
        <?= json_encode($filters) ?>
    )

    return {
        filters
    }
})
</script>
```

---

## Event bus

`bus.on()` returns an unsubscribe function.

Use it inside `effect()` for automatic cleanup.

```js
$$('my-widget', ({
    html,
    bus,
    effect,
    signal
}) => {

    const message = signal('')

    effect(() => {

        const off = bus.on(
            'chat:message',
            payload => {
                message.value = payload.text
            }
        )

        return off
    })

    return () => html`
        <div>
            ${message.value}
        </div>
    `
})
```

Emit from anywhere:

```js
$$('send-btn', ({ html, bus }) => {

    return () => html`
        <button
            onclick=${() =>
                bus.emit(
                    'chat:message',
                    { text: 'Hello' }
                )
            }
        >
            Send
        </button>
    `
})
```

---

# Router

`$$.router(routes)` creates a reactive router.

The router supports:

- hash mode
- history mode
- named routes
- route parameters
- programmatic navigation
- browser Back / Forward
- native `history.pushState()`
- native `history.replaceState()`
- native `hashchange`

The router does **not** depend on `$$.location`.

### Define a router

```js
$$('router', ({ html }) => {

    return $$.router([

        {
            name: 'home',
            path: '/',
            render: () =>
                html`<h1>Home</h1>`
        },

        {
            name: 'user',
            path: '/users/:id',
            render: ({ id }) =>
                html`<h1>User ${id}</h1>`
        },

        {
            name: '404',
            path: '*',
            render: () =>
                html`<h1>Not found</h1>`
        }

    ], {
        mode: 'hash'
    })
})
```

Available modes:

```js
{ mode: 'hash' }
```

or:

```js
{ mode: 'history' }
```

Hash mode is the default.

### Use the router

```js
$$('app-root', ({ html }, { router }) => {

    return () => html`
        <nav>

            <a href=${router.route('home')}>
                Home
            </a>

            <a href=${router.route('user', { id: 1 })}>
                User 1
            </a>

        </nav>

        <main>
            ${router.view()}
        </main>
    `
})
```

### Named routes

Generate a URL without navigating:

```js
router.route('user', {
    id: 42
})
```

For hash mode this returns:

```text
#/users/42
```

For history mode:

```text
/users/42
```

### Programmatic navigation

Navigate to a named route:

```js
$$('router').go('user', {
    id: 42
})
```

Or navigate directly to a path:

```js
$$('router').go('/users/42')
```

### Reactive current route

The current route is available through `router.current`:

```js
const router = $$('router')

console.log(router.current.value)
```

Example:

```js
{
    path: '/users/42',
    route: {
        name: 'user',
        path: '/users/:id'
    },
    params: {
        id: '42'
    }
}
```

Because `current` is a Signal, components automatically update when the URL changes.

### Native URL changes

The router watches the browser URL directly.

For example:

```js
history.pushState(
    null,
    '',
    '/users/42'
)
```

The router automatically updates:

```js
router.current.value
```

The same applies to:

```js
history.replaceState(
    null,
    '',
    '/users/42'
)
```

Browser navigation is also detected:

```js
history.back()
history.forward()
```

In hash mode, changing the hash is detected as well:

```js
window.location.hash = '/users/42'
```

This means the router can work together with other code that changes the URL without requiring `$$.location`.

---

# Location

`$$.location` is a reactive wrapper around the browser's native URL.

It is useful when you need to work with the current URL, pathname and query parameters independently of routing.

The location API does **not** depend on the router.

You can use `$$.location` with or without `$$.router`.

## Current URL

Get the complete current URL:

```js
$$.location.url()
```

Example:

```text
/catalog?page=2&sort=price
```

Get the current pathname:

```js
$$.location.path()
```

Example:

```text
/catalog
```

Get the current query parameters:

```js
$$.location.query.value
```

Example:

```js
{
    page: '2',
    sort: 'price'
}
```

## Read query parameters

Get a single parameter:

```js
$$.location.get('page')
```

Get all parameters:

```js
$$.location.getAll()
```

Example:

```js
{
    page: '2',
    sort: 'price'
}
```

## Set query parameters

Set one parameter:

```js
$$.location.set(
    'page',
    2
)
```

Or several parameters:

```js
$$.location.set({
    page: 2,
    sort: 'price'
})
```

The resulting URL:

```text
/catalog?page=2&sort=price
```

`null` removes a parameter:

```js
$$.location.set({
    page: null,
    sort: 'price'
})
```

Result:

```text
/catalog?sort=price
```

The current path is preserved.

## Replace the current path

```js
$$.location.path('/catalog')
```

The existing query parameters are preserved.

For example, if the current URL is:

```text
/shop?page=2
```

then:

```js
$$.location.path('/catalog')
```

produces:

```text
/catalog?page=2
```

## Replace the complete URL

```js
$$.location.url(
    '/catalog?page=2&sort=price'
)
```

This changes the browser URL without reloading the page.

## Reactive location

`$$.location.current` is a Signal.

```js
$$('catalog-page', ({ html }, { location }) => {

    return () => html`
        <div>
            Path:
            ${location.current.value.path}

            Page:
            ${location.current.value.query.page}
        </div>
    `
})
```

The location state contains:

```js
{
    url,
    path,
    query
}
```

The query is also available separately:

```js
$$.location.query
```

## Browser navigation

For normal browser navigation with a page reload:

```js
$$.location.go('/login')
```

This is equivalent to navigating the browser to the specified URL.

Browser history:

```js
$$.location.back()
```

```js
$$.location.forward()
```

## Replace history entry

Use `replace()` when the current browser history entry should be replaced instead of creating a new one:

```js
$$.location.replace(
    '/catalog?page=1'
)
```

## Location and Router together

`$$.location` and `$$.router` solve different problems.

Use **Router** for application routes:

```js
router.go('user', {
    id: 42
})
```

Use **Location** for URL state such as filters, sorting and pagination:

```js
$$.location.set({
    page: 2,
    sort: 'price'
})
```

They can be used together:

```js
$$('catalogState', ({ signal }) => {

    const page = signal(
        Number(
            $$.location.get('page') || 1
        )
    )

    return {
        page
    }
})
```

The router and location are independent, but both react to native browser URL changes.

---

## File structure

```text
src/
    index.js       entry — defines $$(), mounts on window
    component.js   custom element factory
    state.js       state registry and resolver
    scope.js       lifecycle scopes and effects
    bus.js         event bus
    router.js      reactive router
    location.js    reactive browser location
    signa.d.ts     TypeScript declarations

build.js
```

---

## Browser support

All modern browsers with Web Components support:

- Chrome
- Firefox
- Safari
- Edge

---

## License

MIT
