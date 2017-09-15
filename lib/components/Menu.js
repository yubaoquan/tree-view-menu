'use babel';
/* globals atom */
import _ from '../util';
import EventMixin from '../mixins/event';

export default Object.assign({}, EventMixin, {
    name: 'Menu',
    init() {
        this.createElement();
        this.createPanel();
        this.name = 'menu';
        return this;
    },
    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('tree-view-frequent-menu-panel');

        const message = document.createElement('div');
        message.textContent = 'The TreeViewFastOp package is Alive! It\'s ALIVE!';
        message.classList.add('message');
        this.element.appendChild(message);

        const button = document.createElement('button');
        button.textContent = 'close';
        button.addEventListener('click', () => {
            this.emit('delete');
            this.hide();
        });
        this.element.appendChild(button);
    },
    createPanel() {
        this.panel = atom.workspace.addModalPanel({
            item: this.getElement(),
            visible: false,
        });
        const menuWrapper = this.panel.element;
        _.addClass(menuWrapper, 'tree-view-frequent-menu-menu-container');
    },
    show() {
        this.panel.show();
    },
    hide() {
        this.panel.hide();
    },
    destroy() {
        this.element.remove();
    },
    getElement() {
        return this.element;
    },
});
