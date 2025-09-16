const { defComponent, createRouter } = signa;

// --- Router ---
const router = createRouter(({ html }) => [
    {
        name: "home",
        path: "/",
        render: () => html`<h1>Home</h1>`
    },
    {
        name: "user",
        path: "/users/:id",
        render: ({ id, html }) => html`<h1>User ${id}</h1>`
    },
    {
        name: "about",
        path: "/about",
        render: ({ html }) => html`<h1> About</h1>`
    },
    {
        name: "notfound",
        path: "*",
        render: ({ html }) => html`<h1>404 Not Found</h1>`
    }
]);

defComponent("route-link", ({ prop, html, slot, $this }) => {
    const to = prop({ name: "to", type: String });
    const params = prop({ name: "params", type: Object, default: {} });

    $this.onclick = (e) => {
        if (to.value) {
            router.navigate(to.value, params.value);
        }
    }

    return () => html`${slot.default}`;
});

defComponent("app-root", ({ html }) => {
    return () => html`
        <header>
            <h2>My App</h2>
            <nav>
                <route-link data-to="home"><button>Home</button></route-link>
                <route-link data-to="about"><button>About</button></route-link>
                <route-link data-to="user" .params=${{ id: 123 }}><button>User 123</button></route-link>
                <route-link data-to="user" .params=${{ id: 42 }}><button>User 42</button></route-link>
            </nav>
        </header>

        <main>
            ${router.View()}
        </main>
    `;
});



