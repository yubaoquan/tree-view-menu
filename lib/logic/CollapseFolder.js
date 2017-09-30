'use babel'

import { collapseFolder, expandFolder } from '../util/treeView'
const ExpandCollapseFolder = {}

export default Object.assign(ExpandCollapseFolder, {
    init(args) {
        this.treeView = args.treeView
        return this
    },
    collapseCurrentFolder() {
        // TODO
    },
    collapseOtherFolders() {
        this.getOtherFolderPaths().forEach((folderPath) => {
            collapseFolder(folderPath)
        })

        // TODO
    },
    collapseRootFolder() {
        // TODO
    },
})
