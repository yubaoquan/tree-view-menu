'use babel';
/* globals atom */
import domUtil from '../util/dom';
import _ from '../util/util';
import EventMixin from '../mixins/event';
import BaseButton from './BaseButton';
import { name as packageName } from '../../package.json';

export default Object.assign({}, EventMixin, {
    name: 'Menu',
    buttons: {},
    init() {
        this.createElement();
        this.addButtons();
        this.createPanel();
        return this;
    },
    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add(`${packageName}-panel`);
    },
    addButtons() {
        this.addCloseButton();
    },
    addButton(btnName) {
        if (this.buttons[btnName]) {
            return;
        }
        this.buttonDelete = Object.create(BaseButton).init({
            id: btnName,
            name: _.getBtnNameFromSmallCamel(btnName),
            parentNode: this.element,
        });
        this.buttonDelete.onClick(() => {
            this.emit(btnName);
        });
        this.buttons[btnName] = true;
    },
    removeButton(btnName) {
        Array.from(this.element.children).forEach((child) => {
            if (child.id === btnName) {
                this.element.removeChild(child);
                this.buttons[btnName] = false;
            }
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
        domUtil.addClass(this.wrapper, `${packageName}-panel-container`);
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
