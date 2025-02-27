function myInstance(A, B) {
    if (A == null) {
        return false
    }
    let proto = Object.getPrototypeOf(A)
    while(proto) {
        if (proto === B.prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
}
const A = {}
const B = Object
console.log(myInstance(A, B))