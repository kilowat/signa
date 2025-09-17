signa.defComponent("app-root", ({ html }) => {
    const router = signa.createRouter([
        {
            name: "home",
            path: "/",
            render: () => html`<h1>Home</h1>`
        },
        {
            name: "user",
            path: "/users/:id",
            render: ({ id }) => html`<h1>User ${id}</h1>`
        },
        {
            name: "about",
            path: "/about",
            render: () => html`<h1> About</h1>`
        },
        {
            name: "notfound",
            path: "*",
            render: () => html`<h1>404 Not Found</h1>`
        }
    ]);

    signa.provide('router', router);

    return () => html`
        <header>
            <h2>My App</h2>
            <nav>
                <route-link .to=${`home`}><button>Home</button></route-link>
                <route-link .to=${`about`}><button>About</button></route-link>
                <route-link .to=${`user`} .params=${{ id: 123 }}><button>User 123</button></route-link>
                <route-link .to=${`user`} .params=${{ id: 42 }}><button>User 42</button></route-link>
            </nav>
        </header>

        <main>
            ${router.View()}
        </main>
    `;
});


signa.defComponent("route-link", ({ prop, html, slot, $this }) => {
    const to = prop({ name: "to", type: String });
    const params = prop({ name: "params", type: Object, default: {} });
    const router = signa.inject('router');
    const route = router.route(to.value, params.value);

    $this.setAttribute('href', route ?? '#');

    $this.onclick = (e) => {
        if (to.value) {
            router.navigate(to.value, params.value);
        }
    }

    return () => html`${slot.default}`;
});




