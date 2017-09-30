'use babel'

import path from 'path'
import _ from '../util/util'
const ExpandCollapseFolder = {}

export default Object.assign(ExpandCollapseFolder, {
    init(treeView) {
        this.treeViewUtil = treeView
        return this
    },
    collapseCurrent(currentPath) {
        const closestDir = _.getClosestDir(currentPath)
        this.treeViewUtil.collapseFolder(closestDir)
    },
    async collapseOthers(currentPath, rootPath) {
        while (currentPath !== rootPath) {
            const siblings = await _.getSiblingPaths(currentPath)
            siblings.forEach((pathname) => {
                _.doInDirectory(pathname, () => {
                    this.treeViewUtil.collapseFolder(pathname)
                })
            })
            currentPath = path.dirname(currentPath)
        }
    },
    collapseRoot(rootPath) {
        this.treeViewUtil.collapseFolder(rootPath)
    },
})
