const { defComponent, createRouter } = window.signa;

// --- Router ---
const router = createRouter(({ html }) => [
    {
        name: "home",
        path: "/",
        render: () => html`<h1>🏠 Home</h1>`
    },
    {
        name: "user",
        path: "/users/:id",
        render: ({ id, html }) => html`<h1>👤 User ${id}</h1>`
    },
    {
        name: "about",
        path: "/about",
        render: ({ html }) => html`<h1>ℹ️ About</h1>`
    },
    {
        name: "notfound",
        path: "*",
        render: ({ html }) => html`<h1>❌ 404 Not Found</h1>`
    }
]);

// --- Root component ---
defComponent("app-root", ({ html }) => {
    return () => html`
        <header>
            <h2>My App</h2>
            <nav>
                <route-link data-to="home">Home</route-link>
                <route-link data-to="about">About</route-link>
                <route-link data-to="user" .params=${{ id: 123 }}>User 123</route-link>
                <route-link data-to="user" .params=${{ id: 42 }}>User 42</route-link>
            </nav>
        </header>

        <main>
            ${router.View()}
        </main>
    `;
});

// --- RouteLink component ---
defComponent("route-link", ({ prop, html, slot }) => {
    const to = prop({ name: "to", type: String });
    const params = prop({ name: "params", type: Object, default: {} });

    return () => html`
        <a href=${to.value} onclick=${(e) => {
            e.preventDefault();
            if (to.value) {
                router.navigate(to.value, params.value);
            }
        }}>
            ${slot.default}
        </a>
    `;
});

