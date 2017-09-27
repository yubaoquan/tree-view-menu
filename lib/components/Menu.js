'use babel';
/* globals atom */
import _ from '../util/util';
import EventMixin from '../mixins/event';
import BasePanel from './BasePanel';
import BaseButton from './BaseButton';
import { name as packageName } from '../../package.json';

export default Object.assign({}, BasePanel, EventMixin, {
    name: 'Menu',
    buttons: {},
    init() {
        this.createElement();
        this.addButtons();
        this.createPanel({ extClassName: 'menu' });
        atom.workspace.observeActivePane(() => {
            this.hide();
        });
        this.initTips();
        return this;
    },
    initTips() {
        this.tips = document.createElement('p');
        this.tips.textContent = 'Please add buttons from setting panel.';
    },
    addButtons() {
        this.addCloseButton();
    },
    addButton(btnId, opt = {}) {
        if (this.buttons[btnId]) {
            return;
        }
        if (this.buttons.default) {
            this.removeDefaultBtn();
        }
        const defaultCb = (e) => {
            this.emit(btnId, {
                position: this.position,
            });
        };
        Object.create(BaseButton).init({
            id: btnId,
            name: opt.name || _.getBtnNameFromSmallCamel(btnId),
            className: `${packageName}-btn menu`,
            parentNode: this.element,
            onClick: opt.cb || defaultCb,
        });
        this.buttons[btnId] = true;
    },
    removeButton(btnId) {
        Array.from(this.element.children).forEach((child) => {
            if (child.id === btnId) {
                this.element.removeChild(child);
                delete this.buttons[btnId];
            }
        });
        if (btnId !== 'default') {
            this.checkButtonEmpty();
        }
    },
    removeDefaultBtn() {
        this.removeButton('default');
        this.element.removeChild(this.tips);
    },
    haveButtons() {
        return Object.getOwnPropertyNames(this.buttons).length;
    },
    addTipsAndDefaultBtn() {
        this.element.append(this.tips);
        this.addButton('default', {
            name: 'Add Button',
            cb: () => {
                atom.workspace.open(`atom://config/packages/${packageName}`);
                this.hide();
            },
        });
    },
    checkButtonEmpty() {
        if (!this.haveButtons()) {
            this.addTipsAndDefaultBtn();
        }
    },
    show(position) {
        this.panel.show();
        this.updatePosition(position);
    },
});
