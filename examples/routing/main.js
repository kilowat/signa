defComponent("app-root", ({ html, createRouter, provide, signal }) => {
    const router = createRouter([
        { name: "home", path: "/", render: () => html`<h1>Home</h1>` },
        { name: "user", path: "/users/:id", render: ({ id }) => html`<h1>User ${id}</h1>` },
        { name: "about", path: "/about", render: () => html`<h1>About</h1>` },
        { name: "notfound", path: "*", render: () => html`<h1>404 Not Found</h1>` }
    ]);

    provide('router', router);

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
                <route-link .to=${`home`}><button>Home</button></route-link>
                <route-link .to=${`about`}><button>About</button></route-link>

                <route-link .to=${`user`} .params=${{ id: 123 }}>
                    <button>User 123</button>
                </route-link>

                <route-link .to=${`user`} .params=${params}>
                    <button>User Param</button>
                </route-link>
            </nav>
        </header>

        <main>
            ${router.view()}
        </main>
    `;
});


defComponent("route-link", ({ prop, html, slot, $this, inject, effect }) => {
    const to = prop("to", { type: String });
    const params = prop("params", { type: Object, default: {} });

    const router = inject('router');

    effect(() => {
        const route = router.route(to.value, params.value);
        $this.setAttribute('href', route ?? '#');
    });


    $this.onclick = (e) => {
        e.preventDefault();
        if (to.value) {
            router.navigate(to.value, params.value);
        }
    }

    return () => html`${slot.default}`;
});
