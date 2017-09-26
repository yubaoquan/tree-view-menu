'use babel';

export default {
    inject(node) {
        this.parent = node;
        node.append(this.element);
    },
    getElement() {
        return this.element;
    },
    updatePosition() {
        this.position = this.element.getBoundingClientRect();
    },
    eject() {
        this.parent.removeChild(this.element);
    },
    destroy() {
        this.element.remove();
    },
};
