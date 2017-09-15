'use babel';

export default {
    init(args = {}) {
        const btnEle = document.createElement('button');
        btnEle.textContent = 'menu';
        btnEle.classList = ['tree-view-frequent-menu-btn'];
        Object.assign(btnEle.style, args.style || {});

        this.element = btnEle;
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onClick();
        });
        this.handlers = {};
        return this;
    },
    onClick() {
        console.info('btn click');
        this.getHandlers('click').forEach((handler) => {
            handler({
                path: this.filePath,
            });
        });
    },
    getElement() {
        return this.element;
    },
    inject(node) {
        node.append(this.element);
        this.filePath = node.children[0].dataset.path;
        this.updatePosition();
    },
    updatePosition() {
        console.info('updatePosition');
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
