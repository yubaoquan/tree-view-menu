'use babel';

import BaseButton from './BaseButton';

export default Object.assign(BaseButton, {
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
    inject(node) {
        node.append(this.element);
        this.filePath = node.children[0].dataset.path;
        this.updatePosition();
    },
    onClick() {
        console.info('btn click');
        this.getHandlers('click').forEach((handler) => {
            handler({
                path: this.filePath,
            });
        });
    },
});
