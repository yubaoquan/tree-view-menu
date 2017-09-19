'use babel';
/* global atom */

import domUtil from '../util/dom';
import { name as packageName } from '../../package.json';
import BaseButton from './Basebutton';

export default {
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
    hide() {
        this.panel.hide();
    },
    destroy() {
        this.element.remove();
    },
    getElement() {
        return this.element;
    },
};
