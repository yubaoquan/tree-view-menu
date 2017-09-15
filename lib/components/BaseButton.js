'use babel';

import EventMixin from '../mixins/event';

export default Object.assign({}, EventMixin, {
    init() {
        console.info('base');
    },
    onClick() {},
    inject() {},
    getElement() {
        return this.element;
    },
    updatePosition() {
        this.position = this.element.getBoundingClientRect();
    },
    getPosition() {
        return this.position;
    },
    eject(node) {
        node.removeChild(this.element);
    },
    destroy() {
        this.element.remove();
    },
});
