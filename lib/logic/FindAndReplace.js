'use babel'
/* global atom */

import path from 'path'
import _ from '../util/util'
import notify from '../util/notify'
export default {
    async init(dispatchNode) {
        atom.commands.dispatch(dispatchNode, 'project-find:show')
        const findAndReplace = await atom.packages.activatePackage('find-and-replace')
        this.projectFindView = findAndReplace.mainModule.projectFindView
        this.findView = findAndReplace.mainModule.findView
        this.findPanel = findAndReplace.mainModule.findPanel
        this.pathsEditor = this.projectFindView.pathsEditor
        this.findEditor4Project = this.projectFindView.findEditor
        this.contentEditor = this.findView.findEditor
        this.inited = true
    },
    async findAndReplace({
        node, path2Search, text,
    }) {
        try {
            if (!this.inited) {
                await this.init(node)
            }
            atom.workspace.open(path2Search)
            atom.commands.dispatch(node, 'find-and-replace:show')
            this.contentEditor.setText(text)
            this.findView.confirm()
        } catch (e) {
            notify.error('Error calling find and replace.', e)
        }
    },
    async findInProject({
        node, path2Search, root, text,
    }) {
        try {
            if (!this.inited) {
                await this.init(node)
            }
            const closestDir = _.getClosestDir(path2Search)
            const relativePath = path.relative(root, closestDir)
            this.pathsEditor.setText(relativePath)
            atom.commands.dispatch(node, 'project-find:show')
            this.contentEditor.setText(text)
            this.projectFindView.confirm()
        } catch (e) {
            notify.error('Error searching in project', e)
        }
    },
}
