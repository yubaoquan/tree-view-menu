'use babel'

/**
 * Consider the .gitignore file doesn't have item cross lines.
 * Use glob
 */
import fs from 'fs'
import path from 'path'
import _ from '../util/util'
import { ignoreTypes } from '../config'
import { EOL } from 'os'

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
        const text = await _.exec(
            'git',
            ['rev-parse', '--show-toplevel'],
            _.getClosestDir(pathname)
        )
        return text.trim()
    },
    async isIgnored(pathname) {
        const result = await _.exec(
            'git',
            ['check-ignore', '-v', pathname],
            _.getClosestDir(pathname)
        )
        return result
    },
    async getIgnoredItems(pathname) {
        const ignoreFileContents = await this.getIgnoreFileContent(pathname)
        return ignoreFileContents.split(EOL)
            .map((line) => {
                return line.trim()
            })
            .filter((line) => {
                return line && !line.startsWith('#')
            })
    },
    async getIgnoreFileContent(pathname) {
        try {
            const ignoreFilePath = await this.getIgnoreFilePath(pathname)
            return new Promise((resolve, reject) => {
                fs.readFile(ignoreFilePath, 'utf-8', (err, data) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            })
        } catch (e) {
            console.error('error in getIgnoreFileContent', e)
            return Promise.reject('')
        }
    },
    async getIgnoreFilePath(pathname) {
        const repoRoot = await this.getRepoRoot(pathname)
        return path.resolve(repoRoot, '.gitignore')
    },
    async getIgnoreFileFolder(pathname) {
        const ignoreFilePath = await this.getIgnoreFilePath(pathname)
        return path.dirname(ignoreFilePath)
    },
    async ignore(pathname, options) {
        try {
            const ignoreText = await this.generateIgnoreText(pathname, options)
            const ignoreExists = await this.ignoreTextExists(ignoreText, pathname)
            console.info(ignoreText)
            if (ignoreExists) {
                return true
            }
            return await this.addIgnoreText(ignoreText, pathname)
        } catch (e) {
            console.error('catch exception in ignore', e)
            throw e
        }
    },
    async generateIgnoreText(pathname, { ignoreType, customText }) {
        const entryName = path.basename(pathname)
        ignoreType = +ignoreType
        const ignoreFileFolder = await this.getIgnoreFileFolder(pathname)
        switch (ignoreType) {
            case ignoreTypes.ignoreSpecificFile.value:
                return [
                    path.sep + path.relative(ignoreFileFolder, pathname),
                    '!' + path.sep + path.relative(ignoreFileFolder, pathname) + path.sep,
                ].join(EOL)
            case ignoreTypes.ignoreSpecificFolder.value:
                return path.sep + path.relative(ignoreFileFolder, pathname) + path.sep
            case ignoreTypes.ignoreBySuffix.value:
                const suffix = path.extname(pathname)
                if (!suffix) {
                    throw new TypeError(`This file doesn't have a suffix.`)
                }
                return `**/*${suffix}`
            case ignoreTypes.ignoreFolderWithSameName.value:
                return `${entryName}/`
            case ignoreTypes.ignoreSameName.value:
                console.info('ignore same name', entryName)
                return entryName
            case ignoreTypes.custom.value:
                return customText
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
            return true
        } catch (e) {
            console.error('Ignore fail', e)
        }
    },
}
