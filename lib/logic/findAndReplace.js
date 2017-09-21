'use babel';
/* global atom */

import path from 'path';
import _ from '../util/util';

export default {
    async init(dispatchNode) {
        atom.commands.dispatch(dispatchNode, 'project-find:show');
        const findAndReplace = await atom.packages.activatePackage('find-and-replace');
        this.pathsEditor = findAndReplace.mainModule.projectFindView.pathsEditor;
        this.contentEditor = findAndReplace.mainModule.findView.findEditor;
        console.info(this.pathsEditor, this.contentEditor);
    },
    async initSearchInProject() {
    },
    onFindAndReplace(dispatchNode, path2Search) {
        if (!this.inited) {

        } else {

        }
        console.info(this.contentEditor);
        atom.workspace.open(path2Search);
        atom.commands.dispatch(dispatchNode, 'find-and-replace:toggle');
    },
    async onFindInProject(dispatchNode, path2Search, rootPath) {
        if (!this.inited) {

        } else {

        }
        if (!this.findAndReplaceInited) { // to get the package ref, we have to activate it first
            atom.commands.dispatch(dispatchNode, 'project-find:show');
        } else {
            atom.commands.dispatch(dispatchNode, 'project-find:toggle');
            if (this.findInProjectActive) { // if is already opened, close it
                this.findInProjectActive = false;
                return;
            }
        }
        try {
            const findAndReplace = await atom.packages.activatePackage('find-and-replace');
            console.info(findAndReplace);
            // const pathsEditor = findAndReplace.mainModule.projectFindView.pathsEditor;
            const closestDir = _.getClosestDir(path2Search);
            const relativePath = path.relative(rootPath, closestDir);
            this.pathsEditor.setText(relativePath);
            this.findAndReplaceInited = true;
        } catch (e) {
            console.error('error getting package', e);
        }
    },
};
