'use babel';

import BasePanel from './BasePanel';
import CheckGroupItem from './CheckGroupItem';

export default Object.assign({}, BasePanel, {
    init(args = {}) {
        this.initElement(args);
        this.inject(args.parent);
    },
    initElement(args) {
        const div = document.createElement('div');
        this.element = div;
        args.items.forEach((item) => {
            Object.create(CheckGroupItem)
                .init({
                    ...item,
                    parent: this.element,
                    onCheck: (msg) => {
                        console.info(msg);
                    },
                });
        });
    },
}, BasePanel);
