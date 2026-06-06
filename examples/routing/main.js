sig('appRouter', ({ html }) => {
    return sig.router([
        { name: "home", path: "/", render: () => html`<h1>Home</h1>` },
        { name: "user", path: "/users/:id", render: ({ id }) => html`<h1>User ${id}</h1>` },
        { name: "about", path: "/about", render: () => html`<h1>About</h1>` },
        { name: "notfound", path: "*", render: () => html`<h1>404 Not Found</h1>` }
    ], { mode: 'hash' });
});

sig("app-root", ({ html, state, signal }) => {
    const router = state('appRouter');
    const params = signal({ id: '1' });

    return () => html`
        <header>
            <h2>My App</h2>
            <div>
                <input type="text"
                    .value=${params.value.id}
                    oninput=${(e) => params.value = { id: e.target.value }}>
            </div>
            <nav>
                <route-link .to=${"home"}><button>Home</button></route-link>
                <route-link .to=${"about"}><button>About</button></route-link>

                <route-link .to=${"user"} .params=${{ id: 123 }}>
                    <button>User 123</button>
                </route-link>

                <!-- передаём сам сигнал, не .value — route-link сам разворачивает -->
                <route-link .to=${"user"} .params=${params}>
                    <button>User Param</button>
                </route-link>
            </nav>
        </header>
        <main>
            ${router.view()}
        </main>
    `;
});

sig("route-link", ({ prop, html, slot, $this, state, effect }) => {
    const to = prop("to", String, "");
    const params = prop("params", Object, {});

    const router = state('appRouter');
    const p = params.value?.value ?? params.value;
    const getHref = () => {
        const p = params.value?.value ?? params.value;
        return router.route(to.value, p);
    };

    return () => html`<a href=${getHref()}>${slot.default}</a>`;
});