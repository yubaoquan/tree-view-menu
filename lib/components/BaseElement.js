'use babel'

import domUtil from '../util/dom'

export default {
    addClass(className) {
        domUtil.addClass(this.element, className)
    },
    removeClass(className) {
        domUtil.removeClass(this.element, className)
    },
    inject(node) {
        this.parent = node
        node.append(this.element)
    },
    injectPre(node) {
        this.parent = node
        node.prepend(this.element)
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
