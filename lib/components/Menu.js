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
        return this;
    },
    addButtons() {
        this.addCloseButton();
    },
    addButton(btnName) {
        if (this.buttons[btnName]) {
            return;
        }
        Object.create(BaseButton).init({
            id: btnName,
            name: _.getBtnNameFromSmallCamel(btnName),
            className: `${packageName}-btn menu`,
            parentNode: this.element,
            onClick: (e) => {
                this.emit(btnName, {
                    position: this.position,
                });
            },
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
    show(position) {
        this.panel.show();
        this.updatePosition(position);
    },
    close() {
        this.emit('close');
        this.hide();
    },
});
