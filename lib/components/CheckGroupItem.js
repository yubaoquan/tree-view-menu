'use babel';
import BaseElement from './BaseElement';

export default Object.assign({}, BaseElement, {
    init(args = {}) {
        this.createElement(args);
        this.initEvent();
        this.inject(args.parent);
    },
    createElement(args) {
        const label = document.craeteElement('label');
        const span = document.createElement('span');
        span.textContent = args.title;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = args.value;
        this.checkbox = checkbox;
        label.append(checkbox);
        label.append(span);
        this.element = label;
    },
    initEvent() {
        this.label.addEventListener('click', (e) => {
            console.info(e);
        });
    },
});
