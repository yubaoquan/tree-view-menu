'use babel';
/* global atom */

import domUtil from '../util/dom';
import { name as packageName } from '../../package.json';
import BaseButton from './Basebutton';
import BaseElement from './BaseElement';

export default Object.assign({}, BaseElement, {
    init() {
        this.createElement();
        this.createPanel();
        this.addCloseButton();
    },
    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add(`${packageName}-panel`);
    },
    createPanel(args = {}) {
        this.panel = atom.workspace.addModalPanel({
            item: this.getElement(),
            visible: false,
        });
        this.wrapper = this.panel.element;
        let className = `${packageName}-panel-container`;
        if (args.extClassName) {
            className += ` ${args.extClassName}`;
        }
        domUtil.addClass(this.wrapper, className);
    },
    addCloseButton() {
        const header = document.createElement('header');
        header.className = `${packageName}-panel-header`;
        this.buttonClose = Object.create(BaseButton).init({
            name: '×',
            parentNode: header,
            className: `${packageName}-panel-close-btn`,
            onClick: () => {
                this.close();
            },
        });
        this.element.append(header);
    },
    show() {
        this.panel.show();
    },
    hide() {
        this.panel.hide();
    },
    updatePosition(position) {
        this.wrapper.style.left = position.x + 'px';
        const wrapperHeight = this.wrapper.offsetHeight;
        let y;
        if (position.y + wrapperHeight > window.outerHeight) {
            y = position.y - wrapperHeight;
        } else {
            y = position.y;
        }
        this.wrapper.style.top = y + 'px';
        this.position = {
            x: position.x,
            y,
        };
    },
    getPosition() {
        return this.position;
    },
    close() {
        // abstract
    },
});
