'use babel'
/* globals atom */
import path from 'path'
import notify from '../util/notify'
import trash from 'trash'
import recursive from 'recursive-readdir'
import _ from '../util/util'

function deleteEntry(entryPath, needConfirm) {
    if (needConfirm) {
        return atom.confirm({
            message: `Are you sure you want to delete ${entryPath}?`,
            detailedMessage: `pathToDelete: ${entryPath}`,
            buttons: {
                Delete: async () => deletePathProxy(entryPath),
                Cancel: () => {},
            },
        })
    }
    deletePathProxy(entryPath)
}

async function deletePathProxy(entryPath) {
    const shortPath = path.basename(entryPath)
    try {
        const isDirectory = await _.isDirectory(entryPath)
        if (isDirectory) {
            const filePaths = await recursive(entryPath)
            closeEntryPanes(filePaths)
        }
        trash([entryPath])
    } catch (e) {
        notify.error(`Failed to delete ${shortPath}`, e)
    }
}

function closeEntryPanes(paths) {
    atom.workspace.getTextEditors()
        .forEach(pane => {
            if (paths.includes(pane.getPath())) {
                pane.destroy()
            }
        })
}

export default deleteEntry
