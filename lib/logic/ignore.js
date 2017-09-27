'use babel'

/**
 * Consider the .gitignore file doesn't have item cross lines.
 * Use glob
 */
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import _ from '../util/util'

export default {
    ignoreTypes: {
        ignoreSpecificFile: 0,
        ignoreBySuffix: 1,
        ignoreSpecificFolder: 2,
        ignoreFolderWithSameName: 3,
        ignoreSameName: 4,
    },
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
            return this.getRepoRoot(pathname)
                .then((repoRoot) => {
                    const ignoreFilePath = path.resolve(repoRoot, '.gitignore')
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
    async ignore(pathname, ignoreType) {
        const ignoreText = this.generateIgnoreText(pathname, ignoreType)
        const ignoreExists = await this.ignoreTextExists(pathname, ignoreType)
        if (ignoreExists) {
            return
        }
        this.addIgnoreText(pathname, ignoreText)
    },
    generateIgnoreText(pathname, ignoreType) {
        const entryName = _.getEntryName(this.currentPath)
        switch (ignoreType) {
            case 0:
                return 'building... '
            case 1:
                return 'building... '
            case 2:
                return 'building... '
            case 3:
                return 'building... '
            case 4:
                return 'building... '
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
    async addIgnoreText() {
        // TODO 
    },
}
