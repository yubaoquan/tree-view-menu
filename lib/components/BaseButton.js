'use babel';

import EventMixin from '../mixins/event';
import domUtil from '../util/dom';

export default Object.assign({}, EventMixin, {
    init(config) {
        const element = document.createElement('button');
        element.textContent = config.name || 'button';
        element.className = config.className || '';
        element.style = config.style || {};
        if (config.id) {
            element.id = config.id;
        }
        this.element = element;
        if (config.parentNode) {
            this.inject(config.parentNode);
        }
        this.clickhandlers = [];
        this.element.addEventListener('click', (e) => {
            this.clickhandlers.forEach((handler) => {
                handler(e);
            });
        });
        if (config.onClick) {
            this.onClick(config.onClick);
        }
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
        if (!domUtil.isParent(node, this.element)) {
            return;
        }
        node.removeChild(this.element);
    },
    destroy() {
        this.element.remove();
    },
    updateName(name) {
        this.element.textContent = name;
    },
});
