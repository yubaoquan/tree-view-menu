'use babel';

export default {
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
    on(eventName, fn) {
        this.getHandlers(eventName).push(fn);
    },
    getHandlers(eventName) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        return this.handlers[eventName];
    },
};
