function Child(name, ...args) {
    this.name = name
    Parent.call(name, ...args)
}
function Parent(age) {
    this.age = age
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child