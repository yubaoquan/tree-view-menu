'use babel';
/* globals atom */
import domUtil from '../util/dom';
import EventMixin from '../mixins/event';
import BaseButton from './BaseButton';
import { name as packageName } from '../../package.json';

export default Object.assign({}, EventMixin, {
    name: 'Menu',
    init() {
        this.createElement();
        this.addButtons();
        this.createPanel();
        this.name = 'menu';
        return this;
    },
    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add(`${packageName}-panel`);
    },
    addButtons() {
        this.addCloseButton();
        this.buttonDelete = Object.create(BaseButton).init({
            name: 'delete',
            parentNode: this.element,
        });
        this.buttonDelete.onClick(() => {
            this.emit('delete');
        });
    },
    addCloseButton() {
        const header = document.createElement('header');
        header.className = `${packageName}-menu-header`;
        this.buttonClose = Object.create(BaseButton).init({
            name: '×',
            parentNode: header,
            className: `${packageName}-menu-close-btn`,
        });
        this.buttonClose.onClick(() => {
            this.emit('close');
            console.info('close');
            this.hide();
        });
        this.element.append(header);
    },
    createPanel() {
        this.panel = atom.workspace.addModalPanel({
            item: this.getElement(),
            visible: false,
        });
        this.wrapper = this.panel.element;
        domUtil.addClass(this.wrapper, `${packageName}-menu-container`);
    },
    show(position) {
        this.wrapper.style.left = position.x + 'px';
        this.wrapper.style.top = position.y + 'px';
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
