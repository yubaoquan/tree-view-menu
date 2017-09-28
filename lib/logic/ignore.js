'use babel'

/**
 * Consider the .gitignore file doesn't have item cross lines.
 * Use glob
 */
import fs from 'fs'
import path from 'path'
import _ from '../util/util'
import { ignoreTypes } from '../config'

export default {
    async isInGitRepo(pathname) {
        try {
            const repoRoot = await this.getRepoRoot(pathname)
            return pathname.startsWith(repoRoot)
        } catch (e) {
            console.error('error checking in repo', e)
            return false
        }
    },
    async isRepoRoot(pathname) {
        try {
            const repoRoot = await this.getRepoRoot(pathname)
            return pathname === repoRoot
        } catch (e) {
            console.error('error checking ropo root', e)
            return false
        }
    },
    async getRepoRoot(pathname) {
        return await _.exec(
            'git',
            ['rev-parse', '--show-toplevel'],
            _.getClosestDir(pathname)
        )
    },
    async isIgnored(pathname) {
        const result = await _.exec(
            'git',
            ['check-ignore', '-v', pathname],
            _.getClosestDir(pathname)
        )
        console.info(result)
        return result
    },
    async getIgnoredItems(pathname) {
        const ignoreFileContents = await this.getIgnoreFileContent(pathname)
        return ignoreFileContents.split(/\r?\n/)
            .map((line) => {
                return line.trim()
            })
            .filter((line) => {
                return line && !line.startsWith('#')
            })
    },
    getIgnoreFileContent(pathname) {
        try {
            return this.getIgnoreFilePath(pathname)
                .then((ignoreFilePath) => {
                    fs.readFile(ignoreFilePath, 'utf-8', (err, data) => {
                        if (err) {
                            return ''
                        } else {
                            return data
                        }
                    })
                })
        } catch (e) {
            return Promise.resolve('')
        }
    },
    getIgnoreFilePath(pathname) {
        return this.getRepoRoot(pathname)
            .then((repoRoot) => {
                return path.resolve(repoRoot, '.gitignore')
            })
            .catch((e) => {
                console.error(e)
            })
    },
    async ignore(pathname, ignoreType) {
        try {
            const ignoreText = this.generateIgnoreText(pathname, ignoreType)
            const ignoreExists = await this.ignoreTextExists(pathname, ignoreType)
            if (ignoreExists) {
                return true
            }
            return await this.addIgnoreText(pathname, ignoreText)
        } catch (e) {
            return false
        }
    },
    generateIgnoreText(pathname, ignoreType) {
        const entryName = _.getEntryName(pathname)
        ignoreType = +ignoreType
        switch (ignoreType) {
            case ignoreTypes.ignoreSpecificFile.value:
            case ignoreTypes.ignoreSpecificFolder.value:
                return pathname
            case ignoreTypes.ignoreBySuffix.value:
                return _.getSuffix(pathname)
            case ignoreTypes.ignoreFolderWithSameName.value:
                return `${entryName}/`
            case ignoreTypes.ignoreSameName.value:
                return entryName
            default:
                console.error('Invalid ignore type:', ignoreType)
        }
    },
    async ignoreTextExists(text, pathname) {
        const ignoredItems = await this.getIgnoredItems(pathname)
        return ignoredItems.some((item) => {
            return item === text
        })
    },
    async addIgnoreText(text, pathname) {
        try {
            const ignoreFilePath = await this.getIgnoreFilePath(pathname)
            await _.appendLine(text, ignoreFilePath)
        } catch (e) {
            console.error('Ignore fail', e)
        }
    },
}
