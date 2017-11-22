'use babel'
/* global atom */
import path from 'path'
import fs from 'fs'
import notify from '../util/notify'
import copyDir from 'copy-dir'
import copy from 'cpy'
import _ from '../util/util'
import event from '../mixins/event'

function copyText(value, name) {
    atom.clipboard.write(value)
    notify.success(`${name} copied!`)
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
        this.pathname = pathname
    },
    cutEntry(pathname) {
        this.mode = MODE.cut
        this.pathname = pathname
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
        if (this.notNeedCopy(destPath)) {
            return
        }
        if (!_.isDirectorySync(destPath)) {
            destPath = path.dirname(destPath)
        }
        const basename = path.basename(this.pathname)
        if (this.mode === MODE.cut) {
            const targetPath = path.join(destPath, basename)
            fs.rename(this.pathname, targetPath, err => {
                if (err) {
                    console.error(err)
                    return notify.error(err)
                }
                this.pathname = null
                this.emit('ok')
            })
        }
        if (this.mode === MODE.copy) {
            let copyFn = copy
            if (_.isDirectorySync(this.pathname)) {
                copyFn = copyDir
                destPath = path.join(destPath, basename)
            }
            copyFn(this.pathname, destPath, (err, file) => {
                if (err) {
                    console.error(err)
                    return notify.error('Copy failed', err)
                }
                this.emit('ok')
            })
        }
    },
    notNeedCopy(destPath) {
        return this.pathname == null
            || destPath == null
            || destPath.startsWith(this.pathname)
    },
})
