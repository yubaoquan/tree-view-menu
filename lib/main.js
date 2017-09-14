'use babel';
/* globals atom */
import TreeViewFastOpView from './menu';
import { CompositeDisposable } from 'atom';

export default {

    treeViewFastOpView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        console.info('activate');
        this.mount2TreeView();
        this.treeViewFastOpView = new TreeViewFastOpView(state.treeViewFastOpViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.treeViewFastOpView.getElement(),
            visible: false,
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'tree-view-frequent-menu:toggle': () => this.toggle(),
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.treeViewFastOpView.destroy();
    },

    serialize() {
        return {
            treeViewFastOpViewState: this.treeViewFastOpView.serialize(),
        };
    },

    toggle() {
        console.log('TreeViewFastOp was toggled!');
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    },
    mount2TreeView() {
        const selector = '.list-tree .list-item';
        document.querySelectorAll(selector).forEach((item) => {
            item.addEventListener('mouseover', (e) => {
                if (!this.treeItemMounted(item)) {
                    this.mount2TreeItem(item);
                }
                this.showTrigger(item);
            });
            item.addEventListener('mouseout', (e) => {
                this.hideTrigger(item);
            });
        });
    },
    treeItemMounted(item) {

    },
    mount2TreeItem(item) {

    },
    showTrigger(item) {
        console.dir(item);
        console.info('mouse over');
    },
    hideTrigger() {
        console.info('mouseout');
    },
};
