'use babel';
/* globals atom */
import Menu from './components/Menu';
import TriggerButton from './components/TriggerButton';
import { CompositeDisposable } from 'atom';
import _ from './util/util';
import treeViewUtil from './util/tree-view';
import domUtil from './util/dom';
import onDeleteEntry from './logic/delete';
import config from './config';
import { name as packageName } from '../package.json';

export default {
    config: {
        mode: {
            type: 'string',
            default: 'callMenu',
            enum: config.mode,
            description: '`Single Button` mode, only a functional button avaiable, `Call Menu` mode, can call a menu.',
        },
        singleButtonType: {
            type: 'string',
            default: 'newFile',
            enum: config.buttons,
            description: 'Button type for `Single Button` mode.',
        },
    },
    Menu: null,
    modalPanel: null,
    subscriptions: null,
    treeViewItemSelector: '.list-tree .list-item',
    treeViewFileSelector: '.list-tree .entry.file',
    observeConfig() {
        Object.keys(this.config).forEach((key) => {
            atom.config.observe(`${packageName}.${key}`, (value) => {
                config[key] = value;
                if (key === 'mode') {
                    this.updateMode(value);
                }
            });
        });
    },
    updateMode() {
        this.mode = atom.config.get(`${packageName}.mode`);
        if (!this.activated) {
            return;
        }
        this.updateTriggerBtnName();
    },
    async activate(state) {
        this.updateMode();
        this.observeConfig();
        const getTreeViewSuccess = await this.getTreeView();
        if (!getTreeViewSuccess) {
            return;
        }
        this.listenEntryClick();
        this.initMenu();
        this.initButton();
        this.updateListeningList();

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();
        this.activated = true;
    },
    initMenu() {
        this.menu = Object.create(Menu).init();
        this.menu.on('delete', () => {
            onDeleteEntry(this.currentPath);
            this.menu.hide();
        });
    },
    async getTreeView() {
        try {
            const treeViewPkg = await atom.packages.activatePackage('tree-view');
            if (treeViewPkg.mainModule.createView) {
                this.treeView = treeViewPkg.mainModule.createView();
            } else {
                this.treeView = treeViewPkg.mainModule.getTreeViewInstance();
            }
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },
    listenEntryClick() {
        this.originEntryClicked = this.treeView.entryClicked.bind(this.treeView);
        this.treeView.entryClicked = (e) => {
            const entry = e.target.closest('.entry');
            if (!entry || !treeViewUtil.isDirectory(entry)) {
                return this.originEntryClicked(e);
            }
            this.originEntryClicked(e);
            if (treeViewUtil.isExpanded(entry)) {
                this.mount2Node(entry);
            }
        };
        this.treeView.onFileCreated((e) => {
            setTimeout(() => {
                this.updateListeningList();
            }, 1000);
        });
        this.treeView.onDirectoryCreated((e) => {
            this.updateListeningList();
        });
    },
    initButton() {
        const firstChild = document.querySelector(this.treeViewFileSelector);
        let buttonHeight = 25;
        if (firstChild) {
            buttonHeight = firstChild.offsetHeight;
        }
        this.button = Object.create(TriggerButton).init({
            name: this.getTriggerBtnName(),
            style: {
                height: buttonHeight + 'px',
            },
        });
        this.button.on('click', (msg) => {
            this.onTriggerButtonClicked(msg);
        });
    },
    getTriggerBtnName() {
        switch (this.mode) {
            case 'callMenu': return 'menu';
            case 'singleButton':
                return _.getBtnNameFromSmallCamel(config.singleButtonType);
            default:
                console.error('invalid mode:', this.mode);
                return 'error';
        }
    },
    updateTriggerBtnName() {
        const btnName = this.getTriggerBtnName();
        this.button.updateName(btnName);
    },
    onTriggerButtonClicked(msg) {
        switch (this.mode) {
            case 'callMenu':
                return this.triggerInCallMenuMode(msg);
            case 'singleButton':
                return this.triggerInSingleBtnMode(msg);
            default:
                console.error('invalid mode:', mode);
        }
    },
    triggerInCallMenuMode(msg) {
        this.currentPath = msg.path;
        this.menu.show(msg.position);
    },
    triggerInSingleBtnMode(msg) {
        console.info('trigger in single button mode');
    },
    deactivate() {
        this.died = true;
        this.button.destroy();
        this.menu.destroy();
        this.treeView.entryClicked = this.originEntryClicked;
    },
    serialize() {
        return {};
    },
    updateListeningList() {
        this.treeView.roots.forEach((node) => {
            this.mount2Node(node);
        });
    },
    mount2Node(node) {
        const children = Array.from(node.children || []);
        children.forEach((child) => {
            if (
                domUtil.containClass(child, 'list-item') &&
                !this.inListeningList(child)
            ) {
                child.addEventListener('mouseover', (e) => {
                    this.showButton(child);
                });
                child.addEventListener('mouseout', (e) => {
                    this.onMouseOut(e, child);
                });
                this.add2ListeningList(child);
            }
            if (treeViewUtil.isFolderNode(child)) {
                this.mount2Node(child);
            }
        });
    },
    inListeningList(node) {
        return node.dataset.treeViewFrequentMenu === '1';
    },
    add2ListeningList(node) {
        node.dataset.treeViewFrequentMenu = '1';
    },
    showButton(node) {
        if (this.died) {
            return;
        }
        this.button.inject(node);
    },
    onMouseOut(e, hostNode) {
        if (domUtil.inPosition({
            x: e.pageX,
            y: e.pageY,
        }, this.button.getPosition())) {
            return;
        }
        this.hideButton(hostNode);
    },
    hideButton(node) {
        if (this.died) {
            return;
        }
        this.button.eject(node);
    },
};
