class LRUCache {
    constructor(capacity) {
        this.capacity = capacity
        this.cache = new Map()
    }
    put(key, val) {
        if (this.cache.has(key)) {
            this.cache.delete(key)
            this.cache.set(key, val)
            return
        }
        if (this.cache.size >= this.capacity) {
            const k = this.cache.keys().next().value
            this.cache.delete(k)
        }
        this.cache.set(key, val)
    }
    get(key) {
        if (this.cache.has(key)) {
            const val = this.cache.get(key)
            this.cache.delete(key)
            this.cache.set(key, val)
            return val
        }
        return -1
    }
}
let cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log("cache.get(1)", cache.get(1))// 返回  1
cache.put(3, 3);// 该操作会使得密钥 2 作废
console.log("cache.get(2)", cache.get(2))// 返回 -1 (未找到)
cache.put(4, 4);// 该操作会使得密钥 1 作废
console.log("cache.get(1)", cache.get(1))// 返回 -1 (未找到)
console.log("cache.get(3)", cache.get(3))// 返回  3
console.log("cache.get(4)", cache.get(4))// 返回  4
