'use babel';
/* globals atom */
import _ from '../util/util';
import EventMixin from '../mixins/event';
import BasePanel from './BasePanel';
import BaseButton from './BaseButton';

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
            parentNode: this.element,
            onClick: (e) => {
                this.emit(btnName, {
                    position: {
                        x: e.pageX,
                        y: e.pageY,
                    },
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
            y: y,
        };
        this.panel.show();
    },
    close() {
        this.emit('close');
        this.hide();
    },
});
