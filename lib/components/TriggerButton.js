'use babel';

import BaseButton from './BaseButton';

export default Object.assign({}, BaseButton, {
    name: 'TriggerButton',
    init(args = {}) {
        const btnEle = document.createElement('button');
        btnEle.textContent = 'menu';
        btnEle.classList = ['tree-view-frequent-menu-btn'];
        Object.assign(btnEle.style, args.style || {});

        this.element = btnEle;
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.emit('click', {
                path: this.filePath,
            });
        });
        this.handlers = {};
        return this;
    },
    inject(node) {
        node.append(this.element);
        this.filePath = node.children[0].dataset.path;
        this.updatePosition();
    },
});
