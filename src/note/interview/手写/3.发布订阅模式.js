class EventEmitter {
    constructor() {
        this.events = {}
    }
    on(name, fn) {
        if (!this.events[name]) {
            this.events[name] = []
        }
        this.events[name].push(fn)
    }
    emit(name, ...args) {
        const fns = this.events[name] || []
        fns.forEach((fn) => fn(...args))
    }
    off(name, fn) {
        const fns = this.events[name] || []
        if (fn) {
            this.events[name] = this.events[name].filter(item => item !== fn)
        } else {
            this.events[name] = null
        }
    }
    once(name, fn) {
        const cb = (...args) => {
            fn.apply(this, args)
            this.off(name, cb)
        }
        this.on(name, cb)
    }
}