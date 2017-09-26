'use babel';

import BasePanel from './BasePanel';
import CheckGroup from 'CheckGroup';

export default Object.assign({}, BasePanel, {
    init(args = {}) {
        BasePanel.init();
        this.addIgnoreOptions();
        this.inject(args.parent);
    },
    createElement() {
        const div = document.createElement('div');
        this.element = div;
        this.addIgnoreOptions();
    },
    addIgnoreOptions() {
        Object.create(CheckGroup)
            .init({
                parent: this.element,
                items: [
                    {
                        title: '',
                        value: 0,
                    }, {
                        title: '',
                        value: 1,
                    }, {
                        title: 2,
                        value: '',
                    },
                ],
                onSelect: (msg) => {
                    console.info(msg);
                },
            });;
    },
});
