'use babel';
/* globals atom */
import Menu from './components/Menu';
import TriggerButton from './components/TriggerButton';
import { CompositeDisposable } from 'atom';
import _ from './util/util';
import onDeleteEntry from './logic/delete';

export default {
    Menu: null,
    modalPanel: null,
    subscriptions: null,
    treeViewItemSelector: '.list-tree .list-item',
    treeViewFileSelector: '.list-tree .entry.file',
    async activate(state) {
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
            if (!entry || !_.isDirectory(entry)) {
                return this.originEntryClicked(e);
            }
            this.originEntryClicked(e);
            if (_.isExpanded(entry)) {
                this.mount2Node(entry);
            }
        };
        this.treeView.onFileCreated((e) => {
            console.info('file created');
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
            style: {
                height: buttonHeight + 'px',
            },
        });
        this.button.on('click', (msg) => {
            this.currentPath = msg.path;
            this.menu.show(msg.position);
        });
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
                _.containClass(child, 'list-item') &&
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
            if (_.isFolderNode(child)) {
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
        if (_.inPosition({
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
