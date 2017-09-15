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
            console.info('btn click');
            console.info(this.filePath);
        });
    },
    getElement() {
        return this.element;
    },
    inject(node) {
        node.append(this.element);
        this.filePath = node.children[0].dataset.path;
        // console.info()
    },
    eject() {
        console.info('eject');
    },
};
