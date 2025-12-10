defComponent('test-component', (ctx) => {
    ctx.$this.show = () => {
        console.log('hi')
    }
})