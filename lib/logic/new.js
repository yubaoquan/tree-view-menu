'use babel'
/* global atom */
import fs from 'fs'

export default {
    createFile(pathname) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(pathname)) {
                return reject('File exists')
            }
            try {
                fs.open(pathname, 'w', (err) => {
                    if (err) {
                        return reject(err)
                    }
                    atom.workspace.open(pathname)
                    resolve()
                })
            } catch (e) {
                reject(e)
            }
        })
    },
    createFolder(pathname) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(pathname)) {
                return reject('Folder exists')
            }
            try {
                fs.mkdir(pathname, (err) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve()
                })
            } catch (e) {
                reject(e)
            }
        })
    },
}
