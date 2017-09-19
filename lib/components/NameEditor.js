'use babel';

import BasePanel from './BasePanel';
import BaseButton from './BaseButton';
import EventMixin from '../mixins/event';

export default Object.assign({}, EventMixin, BasePanel, {
    init() {
        this.createElement();
        this.createPanel({ extClassName: 'rename' });
        this.addCloseButton();
        this.addSections();
        return this;
    },
    addSections() {
        const inputWrapper = document.createElement('section');
        this.addInput(inputWrapper);
        const btnWrapper = document.createElement('section');
        this.addButtons(btnWrapper);
        this.element.append(inputWrapper);
        this.element.append(btnWrapper);
    },
    addInput(node) {
        const input = document.createElement('input');
        input.type = 'text';
        node.append(input);
        input.className = 'native-key-bindings input';
        this.input = input;
    },
    addButtons(node) {
        this.confirmBtn = Object.create(BaseButton)
            .init({
                parentNode: node,
                name: 'confirm',
                onClick: () => {
                    this.emit('confirm', this.input.value);
                },
            });
        this.cancelBtn = Object.create(BaseButton)
            .init({
                parentNode: node,
                name: 'cancel',
                onClick: () => {
                    this.close();
                },
            });
    },
    show(position) {
        this.wrapper.style.left = position.x + 'px';
        const wrapperHeight = this.wrapper.offsetHeight;
        if (position.y + wrapperHeight > window.outerHeight) {
            this.wrapper.style.top = position.y - wrapperHeight + 'px';
        } else {
            this.wrapper.style.top = position.y + 'px';
        }
        this.panel.show();
    },
    close() {
        this.emit('cancel');
        this.hide();
    },
    updateValue(value) {
        this.input.value = value;
    },
});
