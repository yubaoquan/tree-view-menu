'use babel';

import EventMixin from '../mixins/event';

export default Object.assign({}, EventMixin, {
    init(config) {
        const element = document.createElement('button');
        element.textContent = config.name || 'button';
        element.className = config.className || '';
        element.style = config.style || {};
        this.element = element;
        if (config.parentNode) {
            this.inject(config.parentNode);
        }
        this.clickhandlers = [];
        this.element.addEventListener('click', () => {
            this.clickhandlers.forEach((handler) => {
                handler();
            });
        });
        return this;
    },
    onClick(handler) {
        this.clickhandlers.push(handler);
    },
    inject(node) {
        node.append(this.element);
    },
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
    updateName(name) {
        this.element.textContent = name;
    },
});
