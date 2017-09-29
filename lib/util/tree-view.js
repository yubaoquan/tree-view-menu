'use babel'

import domUtil from './dom'

export default {
    init(args) {
        this.treeView = args.treeView
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
        this.treeView.selectEntryForPath(pathname)
    },
    expandFolder(pathname) {
        this.selectEntry(pathname)
        this.treeView.expandDirectory()
    },
    collapseFolder(pathname) {
        this.selectEntry(pathname)
        this.treeView.collapseDirectory()
    },
}
