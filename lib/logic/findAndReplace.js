'use babel'
/* global atom */

import path from 'path'
import _ from '../util/util'
import notify from '../util/notify'
export default {
    async init(dispatchNode) {
        atom.commands.dispatch(dispatchNode, 'project-find:show')
        const findAndReplace = await atom.packages.activatePackage('find-and-replace')
        this.pathsEditor = findAndReplace.mainModule.projectFindView.pathsEditor
        this.findEditor4Project = findAndReplace.mainModule.projectFindView.findEditor
        this.contentEditor = findAndReplace.mainModule.findView.findEditor
        this.inited = true
    },
    async findAndReplace(dispatchNode, path2Search) {
        try {
            if (!this.inited) {
                await this.init(dispatchNode)
            }
            atom.workspace.open(path2Search)
            atom.commands.dispatch(dispatchNode, 'find-and-replace:show')
            this.contentEditor.setText('')
        } catch (e) {
            notify.error('Error calling find and replace.', e)
        }
    },
    async findInProject(dispatchNode, path2Search, rootPath) {
        try {
            if (!this.inited) {
                await this.init(dispatchNode)
            }
            atom.commands.dispatch(dispatchNode, 'project-find:show')
            const closestDir = _.getClosestDir(path2Search)
            const relativePath = path.relative(rootPath, closestDir)
            this.contentEditor.setText('')
            this.pathsEditor.setText(relativePath)
        } catch (e) {
            notify.error('Error searching in project', e)
        }
    },
}
