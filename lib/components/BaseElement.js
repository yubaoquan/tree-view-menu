'use babel'

export default {
    inject(node) {
        this.parent = node
        node.append(this.element)
    },
    getElement() {
        return this.element
    },
    updatePosition() {
        this.position = this.element.getBoundingClientRect()
    },
    eject() {
        if (!this.parent) {
            return
        }
        this.parent.removeChild(this.element)
        this.parent = null
    },
    destroy() {
        this.element.remove()
    },
}
