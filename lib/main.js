'use babel';
/* globals atom */
import Menu from './components/Menu';
import NameEditor from './components/NameEditor';
import TriggerButton from './components/TriggerButton';
import { CompositeDisposable } from 'atom';
import _ from './util/util';
import treeViewUtil from './util/tree-view';
import domUtil from './util/dom';
import deleteEntry from './logic/delete';
import config from './config';
import { name as packageName } from '../package.json';
import {
    copyFullPath,
    copyProjectPath,
    copyEntryName,
} from './logic/copyPaste';
import rename from './logic/rename';
import notify from './util/notify';

export default {
    config: {
        ...config.menuBtns,
        mode: {
            order: 1,
            type: 'string',
            default: 'callMenu',
            enum: config.modes,
            description: '`Single Button` mode, only a functional button avaiable, `Call Menu` mode, can call a menu.',
        },
        singleButtonType: {
            order: config.singleButtonTypes.length + 2,
            type: 'string',
            default: 'newFile',
            enum: config.singleButtonTypes,
            description: 'Button type for `Single Button` mode.',
        },
        askForSureBeforeDelete: {
            order: config.singleButtonTypes.length + 3,
            type: 'boolean',
            default: true,
            description: 'Let user to confirm again before delete file or folder',
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
                if (key === 'singleButtonType') {
                    this.updateTriggerBtnName();
                }
                if (config.buttons.some((btn) => {
                    return btn.value === key;
                })) {
                    this.updateMenu(key, value);
                }
            });
        });
    },
    updateMode() {
        this.updateTriggerBtnName();
        this.menu.hide();
    },
    updateMenu(btnName, enable) {
        if (enable) {
            return this.menu.addButton(btnName);
        }
        this.menu.removeButton(btnName);
    },
    async activate(state) {
        const getTreeViewSuccess = await this.getTreeView();
        if (!getTreeViewSuccess) {
            return;
        }
        this.listenEntryClick();
        this.initMenu();
        this.initButton();
        this.initNameEditor();
        this.updateListeningList();

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();
        this.observeConfig();
        this.activated = true;
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
            this.updateListeningList(true);
        });
        this.treeView.onDirectoryCreated((e) => {
            this.updateListeningList(true);
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
    initNameEditor() {
        this.nameEditor = Object.create(NameEditor)
            .init();
        this.nameEditor.on('confirm', (e) => {
            this.onRenameConfirm(e);
        });
    },
    getTriggerBtnName() {
        switch (config.mode) {
            case 'callMenu': return 'menu';
            case 'singleButton':
                return _.getBtnNameFromSmallCamel(config.singleButtonType);
            default:
                console.error('invalid mode:', config.mode);
                return 'error';
        }
    },
    updateTriggerBtnName() {
        const btnName = this.getTriggerBtnName();
        this.button.updateName(btnName);
    },
    onTriggerButtonClicked(msg) {
        this.currentPath = msg.path;
        switch (config.mode) {
            case 'callMenu':
                return this.triggerInCallMenuMode(msg);
            case 'singleButton':
                return this.triggerInSingleBtnMode(msg);
            default:
                console.error('invalid mode:', config.mode);
        }
    },
    triggerInCallMenuMode(msg) {
        this.menu.show(msg.position);
    },
    initMenu() {
        this.menu = Object.create(Menu).init();
        this.menu.on('newFile', () => {
            console.info('new file');
        });
        this.menu.on('copyFullPath', () => {
            this.onCopyFullPath();
            this.menu.hide();
        });
        this.menu.on('copyProjectPath', () => {
            this.onCoypProjectPath();
            this.menu.hide();
        });
        this.menu.on('copyName', () => {
            this.onCopyName();
            this.menu.hide();
        });
        this.menu.on('close', () => {
            this.onCloseFile();
            this.menu.hide();
        });
        this.menu.on('delete', () => {
            this.onDelete();
            this.menu.hide();
        });
        this.menu.on('rename', (msg) => {
            this.onRename(msg);
        });
    },
    triggerInSingleBtnMode(msg) {
        switch (config.singleButtonType) {
            case 'copyFullPath':
                return this.onCopyFullPath();
            case 'copyProjectPath':
                return this.onCoypProjectPath();
            case 'copyName':
                return this.onCopyName();
            case 'close':
                return this.onCloseFile();
            case 'delete':
                return this.onDelete();
            case 'rename':
                return this.onRename(msg);
            default:
                console.error('Invalid type', config.singleButtonType);
        }
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
    updateListeningList(delay) {
        let timeout = 0;
        if (delay) {
            timeout = 1000;
        }
        setTimeout(() => {
            this.treeView.roots.forEach((node) => {
                this.mount2Node(node);
            });
        }, timeout);
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
    // on menu buttons click
    onCopyFullPath() {
        copyFullPath(this.currentPath);
    },
    onCoypProjectPath() {
        copyProjectPath(this.currentPath);
    },
    onCopyName() {
        copyEntryName(this.currentPath);
    },
    onDelete() {
        deleteEntry(this.currentPath, config.askForSureBeforeDelete);
    },
    onCloseFile() {
        _.closeEntryPane(this.currentPath);
    },
    onRename(msg) {
        const entryName = _.getEntryName(this.currentPath);
        this.nameEditor.show(msg.position);
        this.nameEditor.updateValue(entryName);
    },
    async onRenameConfirm(newName) {
        try {
            const success = await rename(this.currentPath, newName);
            if (success) {
                this.updateListeningList(true);
                return this.nameEditor.hide();
            }
            notify.error('Rename fail');
            this.nameEditor.reset();
        } catch (e) {
            notify.error('Rename fail');
            this.nameEditor.reset();
            // console.error(e);
        }
    },
};
