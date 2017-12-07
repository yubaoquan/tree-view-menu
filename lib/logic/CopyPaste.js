'use babel'
/* global atom */
import path from 'path'
import fs from 'fs'
import notify from '../util/notify'
import copyDir from 'copy-dir'
import copy from 'cpy'
import _ from '../util/util'
import event from '../mixins/event'
import clipboardy from 'clipboardy'

function copyText(value, name) {
    clipboardy.writeSync(value)
    if (name) {
        notify.success(`${name} copied!`)
    }
}

const MODE = {
    cut: 1,
    copy: 2,
}
export default Object.assign({}, event, {
    copyFullPath(fullPath) {
        copyText(fullPath, 'Full path')
    },
    copyProjectPath(fullPath) {
        const relativePath = atom.project.relativizePath(fullPath)[1]
        copyText(relativePath, 'Project path')
    },
    copyEntryName(fullPath) {
        const arr = fullPath.split(path.sep)
        const entryName = arr[arr.length - 1]
        copyText(entryName, 'Name')
    },
    copyEntry(pathname) {
        this.mode = MODE.copy
        copyText(pathname, 'entry')
    },
    cutEntry(pathname) {
        this.mode = MODE.cut
        copyText(pathname, 'entry')
    },
    duplicateEntry(srcPath, destPath) {
        if (fs.existsSync(destPath)) {
            notify.error('Duplicate fail.', `${destPath} already exists.`)
        }
        copy(srcPath, destPath, err => {
            if (err) {
                console.error(err)
                return notify.error('Duplicate fail.', err)
            }
            this.emit('ok')
        })
    },
    pasteEntry(destPath) {
        const originPath = clipboardy.readSync()
        if (this.notNeedCopy(originPath, destPath)) {
            return
        }
        if (!_.isDirectorySync(destPath)) {
            destPath = path.dirname(destPath)
        }
        const basename = path.basename(originPath)

        if (this.mode === MODE.cut) {
            const targetPath = path.join(destPath, basename)
            fs.rename(originPath, targetPath, err => {
                if (err) {
                    console.error(err)
                    return notify.error(err)
                }
                clipboardy.writeSync('')
                this.emit('ok')
            })
        } else { // default regard as copy
            let copyFn = copy
            if (_.isDirectorySync(originPath)) {
                copyFn = copyDir
                destPath = path.join(destPath, basename)
            }
            copyFn(originPath, destPath, (err, file) => {
                if (err) {
                    console.error(err)
                    return notify.error('Copy failed', err)
                }
                this.emit('ok')
            })
        }
    },
    notNeedCopy(originPath, destPath) {
        if (!originPath || !fs.existsSync(originPath)) {
            notify.error(`[${originPath}] is not a entry path`)
            return true
        }
        if (!destPath) {
            notify.error('Paste destination not found.')
            return true
        }
        if (destPath.startsWith(originPath)) {
            notify.error('Paste destination is in copy target')
            return true
        }
    },
})
