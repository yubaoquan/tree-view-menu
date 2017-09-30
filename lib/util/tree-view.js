'use babel'

import domUtil from './dom'

export default {
    init(treeView) {
        this.treeView = treeView
        return this
    },
    isFolderNode(node) {
        return domUtil.containClass(node, 'entries')
            || domUtil.containClass(node, 'directory')
    },
    isDirectory(node) {
        return domUtil.containClass(node, 'directory')
    },
    isExpanded(node) {
        return domUtil.containClass(node, 'expanded')
    },
    selectEntry(pathname) {
        return this.treeView.selectEntryForPath(pathname)
    },
    expandFolder(pathname) {
        this.selectEntry(pathname)
        this.treeView.expandDirectory()
    },
    collapseFolder(pathname) {
        const folder = this.selectEntry(pathname)
        if (this.isExpanded(folder)) {
            this.treeView.collapseDirectory()
        }
    },
}
