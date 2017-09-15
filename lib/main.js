'use babel';
/* globals atom */
import TreeViewFastOpView from './menu';
import Button from './button';
import { CompositeDisposable } from 'atom';
import _ from './util';

export default {
    treeViewFastOpView: null,
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
        this.initButton();
        this.updateListeningList();
        this.treeViewFastOpView = new TreeViewFastOpView(state.treeViewFastOpViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.treeViewFastOpView.getElement(),
            visible: false,
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();
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
        const originEntryClicked = this.treeView.entryClicked.bind(this.treeView);
        this.treeView.entryClicked = (e) => {
            const entry = e.target.closest('.entry');
            if (!_.isDirectory(entry)) {
                return originEntryClicked(e);
            }
            originEntryClicked(e);
            if (_.isExpanded(entry)) {
                this.mount2Node(entry);
            }
        };
    },
    initButton() {
        const firstChild = document.querySelector(this.treeViewFileSelector);
        let buttonHeight = 25;
        if (firstChild) {
            buttonHeight = firstChild.offsetHeight;
        }
        this.button = Object.create(Button);
        this.button.init({
            style: {
                height: buttonHeight + 'px',
            },
        });
    },
    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.treeViewFastOpView.destroy();
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
            if (_.containClass(child, 'list-item') &&
            !this.inListeningList(child)
        ) {
                child.addEventListener('mouseover', (e) => {
                    this.showTrigger(child);
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
    showTrigger(node) {
        this.button.inject(node);
    },
};
