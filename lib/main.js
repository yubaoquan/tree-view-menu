'use babel'
/* globals atom */

import path from 'path'

import config from './config'
import { CompositeDisposable } from 'atom'
import { name as packageName } from '../package.json'

import { buttons } from './constant'
import Menu from './components/Menu'
import NameEditor from './components/NameEditor'
import IgnorePanel from './components/IgnorePanel'
import TriggerButton from './components/TriggerButton'

import _ from './util/util'
import domUtil from './util/dom'
import notify from './util/notify'
import TreeViewUtil from './util/tree-view'

import rename from './logic/rename'
import ignore from './logic/ignore'
import { dispatch } from './logic/dispatch'
import copyPaste from './logic/CopyPaste'
import deleteEntry from './logic/delete'
import CollapseFolder from './logic/CollapseFolder'
import findAndReplace from './logic/FindAndReplace'
import { createFile, createFolder } from './logic/new'

const configCache = {}
Object.keys(config).forEach(key => {
    configCache[key] = config[key].default
})

export default Object.assign({}, {
    config,
    subscriptions: null,
    treeViewFileSelector: '.list-tree .entry.file',
    async activate(state) {
        const treeViewInstance = await this.getTreeView()
        if (!treeViewInstance) {
            return
        }
        this.treeView = treeViewInstance
        this.treeViewUtil = Object.create(TreeViewUtil)
            .init(treeViewInstance)
        this.collapseLogic = Object.create(CollapseFolder)
            .init(this.treeViewUtil)
        this.listenEntryClick()
        this.initMenu()
        this.initIgnorePanel()
        this.initButton()
        this.initNameEditor()
        this.updateListeningList()
        this.findAndReplace = findAndReplace

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable()
        this.observeConfig()
        this.copyTool = Object.create(copyPaste)
        this.copyTool.on('ok', e => {
            this.updateListeningList(true)
        })
        this.activated = true
    },
    observeConfig() {
        Object.keys(this.config).forEach(key => {
            atom.config.observe(`${packageName}.${key}`, value => {
                configCache[key] = value
                if (key === 'mode') {
                    return this.updateMode(value)
                }
                if (key === 'singleButtonType') {
                    return this.updateTriggerBtnName()
                }
                if (buttons.some(btn => {
                    return btn.value === key
                })) {
                    return this.updateMenu(key, value)
                }
                if (key.includes('-alias')) {
                    const btnId = key.split('-')[0]
                    this.menu.updateBtnName(btnId, value)
                }
                if (['menuWidth', 'menuHeight'].includes(key)) {
                    this.menu.updateSizeCfg({
                        width: configCache.menuWidth,
                        height: configCache.menuHeight,
                    })
                }
                if (key === 'menuButtonWidth') {
                    this.menu.updateButtonsWidth(value)
                }
                if (key === 'buttonPosition') {
                    this.button.togglePosition(value)
                }
            })
        })
    },
    updateMode() {
        this.updateTriggerBtnName()
        this.menu.hide()
    },
    updateMenu(btnId, enable) {
        if (enable) {
            this.menu.addButton(btnId, {
                name: configCache[`${btnId}-alias`],
            })
        } else {
            this.menu.removeButton(btnId)
        }
    },
    async getTreeView() {
        try {
            const treeViewPkg = await atom.packages.activatePackage('tree-view')
            if (treeViewPkg.mainModule.createView) {
                return treeViewPkg.mainModule.createView()
            } else {
                return treeViewPkg.mainModule.getTreeViewInstance()
            }
        } catch (e) {
            throw new Error('tree-view package not found or not activated')
        }
    },
    listenEntryClick() {
        this.originEntryClicked = this.treeView.entryClicked.bind(this.treeView)
        this.treeView.entryClicked = e => {
            const entry = e.target.closest('.entry')
            if (!entry || !this.treeViewUtil.isDirectory(entry)) {
                return this.originEntryClicked(e)
            }
            this.originEntryClicked(e)
            if (this.treeViewUtil.isExpanded(entry)) {
                this.mount2Node(entry, entry.dataset.root)
            }
        }
        this.treeView.onFileCreated(e => {
            this.updateListeningList(true)
        })
        this.treeView.onDirectoryCreated(e => {
            this.updateListeningList(true)
        })
    },
    initButton() {
        const firstChild = document.querySelector(this.treeViewFileSelector)
        let buttonHeight = 25
        if (firstChild) {
            buttonHeight = firstChild.offsetHeight
        }
        this.button = Object.create(TriggerButton).init({
            name: this.getTriggerBtnName(),
            style: {
                height: buttonHeight + 'px',
            },
        })
        this.button.on('click', msg => {
            this.onTriggerButtonClicked(msg)
        })
    },
    initNameEditor() {
        this.nameEditor = Object.create(NameEditor)
            .init({
                onConfirm: msg => {
                    this.onNameEditorConfirm(msg)
                },
            })
    },
    getTriggerBtnName() {
        switch (configCache.mode) {
            case 'callMenu': return 'menu'
            case 'singleButton':
                return _.getBtnNameFromSmallCamel(configCache.singleButtonType)
            default:
                console.error('invalid mode:', configCache.mode)
                return 'error'
        }
    },
    updateTriggerBtnName() {
        const btnName = this.getTriggerBtnName()
        this.button.updateName(btnName)
    },
    onTriggerButtonClicked(msg) {
        this.currentPath = msg.path
        this.currentNode = msg.node
        this.currentRoot = msg.node.dataset.root
        switch (configCache.mode) {
            case 'callMenu':
                return this.menu.show(msg.position)
            case 'singleButton':
                const methodName = 'on' + _.camelShift(configCache.singleButtonType, true)
                return this[methodName](msg)
            default:
                console.error('invalid mode:', configCache.mode)
        }
    },
    initMenu() {
        this.menu = Object.create(Menu).init({
            buttonWidth: configCache.menuButtonWidth,
        })
        buttons.forEach(btn => {
            const btnValue = btn.value
            const methodName = 'on' + _.camelShift(btnValue, true)
            this.menu.on(btnValue, msg => {
                this[methodName](msg)
                this.menu.hide()
            })
        })
    },
    initIgnorePanel() {
        this.ignorePanel = Object.create(IgnorePanel)
            .init({
                onConfirm: msg => {
                    this.onIgnoreConfirm(msg)
                },
            })
    },
    deactivate() {
        this.died = true
        this.button.destroy()
        this.menu.destroy()
        this.treeView.entryClicked = this.originEntryClicked
    },
    serialize() {
        return {}
    },
    updateListeningList(delay) {
        let timeout = 0
        if (delay) {
            timeout = 1000
        }
        setTimeout(() => {
            this.treeView.roots.forEach(root => {
                const rootNode = root.querySelector('[data-path]')
                const rootPath = rootNode.dataset.path
                if (!rootNode) {
                    notify.error('Project root node not found!')
                    return
                }
                this.mount2Node(root, rootPath)
            })
        }, timeout)
    },
    mount2Node(node, rootPath) {
        node.dataset.root = rootPath
        const children = Array.from(node.children || [])
        children.forEach(child => {
            if (
                domUtil.containClass(child, 'list-item') &&
                !this.inListeningList(child)
            ) {
                child.addEventListener('mouseover', e => {
                    if (!this.died) {
                        this.button.inject(child)
                    }
                })
                child.addEventListener('mouseout', e => {
                    this.onMouseOut(e)
                })
                child.dataset.root = rootPath
                child.dataset.treeViewFrequentMenu = '1'
            }
            if (this.treeViewUtil.isFolderNode(child)) {
                this.mount2Node(child, rootPath)
            }
        })
    },
    inListeningList(node) {
        return node.dataset.treeViewFrequentMenu === '1'
    },
    onMouseOut(e) {
        if (domUtil.inPosition({
            x: e.pageX,
            y: e.pageY,
        }, this.button.getPosition())) {
            return
        }
        if (!this.died) {
            this.button.eject()
        }
    },
    // on menu buttons click
    onNewFile(msg) {
        this.updateNameEditor(msg.position, 'newFile')
    },
    onNewFolder(msg) {
        this.updateNameEditor(msg.position, 'newFolder')
    },
    onFindAndReplace(msg) {
        const text2Search = configCache.keepSearchTextAfterSearch ?
            this.searchedText : ''
        this.updateNameEditor(msg.position, 'findAndReplace', text2Search)
    },
    onSearchInDirectory(msg) {
        const text2Search = configCache.keepSearchTextAfterSearch ?
            this.searchedText : ''
        this.updateNameEditor(msg.position, 'searchInDirectory', text2Search)
    },
    updateNameEditor(position, type, text) {
        this.nameEditor.update({
            text, position, type,
        })
        this.nameEditor.show()
    },

    onCopy() {
        this.copyTool.copyEntry(this.currentPath)
    },
    onCut() {
        this.copyTool.cutEntry(this.currentPath)
    },
    onDuplicate(msg) {
        this.nameEditor.update({
            position: msg.position,
            text: this.currentPath,
            type: 'duplicate',
        })
        this.nameEditor.show()
    },
    onPaste() {
        this.copyTool.pasteEntry(this.currentPath)
    },
    onCopyFullPath() {
        this.copyTool.copyFullPath(this.currentPath)
    },
    onCoypProjectPath() {
        this.copyTool.copyProjectPath(this.currentPath)
    },
    onCopyName() {
        this.copyTool.copyEntryName(this.currentPath)
    },
    onDelete() {
        deleteEntry(this.currentPath, configCache.askForSureBeforeDelete)
    },
    closePane() {
        _.closeEntryPane(this.currentPath)
    },
    onRename(msg) {
        this.nameEditor.update({
            position: msg.position,
            text: path.basename(this.currentPath),
            type: 'rename',
        })
        this.nameEditor.show()
    },
    async onNameEditorConfirm(msg) {
        let newPath
        switch (msg.type) {
            case 'newFile':
                newPath = _.getNewPath4Create(this.currentPath, msg.value)
                return this.onNewFileConfirm(newPath)
            case 'newFolder':
                newPath = _.getNewPath4Create(this.currentPath, msg.value)
                return this.onNewFolderConfirm(newPath)
            case 'rename':
                newPath = _.getNewPath4Rename(this.currentPath, msg.value)
                return this.onRenameConfirm(newPath)
            case 'duplicate':
                return this.copyTool.duplicateEntry(this.currentPath, msg.value)
            case 'findAndReplace':
                return this.onFindAndReplaceConfirm(msg.value)
            case 'searchInDirectory':
                return this.onSearchInDirectoryConfirm(msg.value)
            default:
                console.error('Invalid confirm type:', msg.type)
        }
    },
    async onNewFileConfirm(pathname) {
        try {
            await createFile(pathname)
            this.nameEditor.hide()
            this.updateListeningList(true)
        } catch (e) {
            notify.error('Creating new file failed.', e)
        }
    },
    async onNewFolderConfirm(pathname) {
        try {
            await createFolder(pathname)
            this.nameEditor.hide()
            this.updateListeningList(true)
        } catch (e) {
            notify.error('Creating new folder failed.', e)
        }
    },
    async onRenameConfirm(newPath) {
        try {
            await rename(this.currentPath, newPath)
            this.updateListeningList(true)
            return this.nameEditor.hide()
        } catch (e) {
            notify.error('Rename fail', e)
            console.error(e)
            this.nameEditor.reset()
        }
    },
    onFindAndReplaceConfirm(text) {
        this.searchedText = text
        const node = this.currentNode
        if (_.isDirectorySync(this.currentPath)) {
            notify.error(`Can't do find and replace to a folder`)
            return
        }
        this.findAndReplace.findAndReplace({
            node,
            text,
            path2Search: this.currentPath,
        })
    },
    onSearchInDirectoryConfirm(text) {
        this.searchedText = text
        const node = this.currentNode.parentNode
        this.findAndReplace.findInProject({
            node,
            text,
            path2Search: this.currentPath,
            root: this.currentRoot,
        })
    },
    async onIgnore(msg) {
        let targetType = 'file'
        if (_.isDirectorySync(this.currentPath)) {
            targetType = 'folder'
        }
        if (!ignore.isInGitRepo(this.currentPath, this.currentRoot)) {
            notify.error(`This ${targetType} is not in a git repository.`)
            return
        }
        const isRoot = await ignore.isRepoRoot(this.currentPath)
        if (isRoot) {
            return notify.error(
                `This is the root of git repository`,
                `Ignoring all files in a git repo doesn't make sence`
            )
        }
        this.ignorePanel.update({
            position: msg.position,
            pathname: this.currentPath,
        })
        this.ignorePanel.show(msg)
    },
    async onIgnoreConfirm(msg) {
        let ignoreSucceed = false
        let errorDesc
        try {
            ignoreSucceed = await ignore.ignore(this.currentPath, msg)
        } catch (e) {
            console.error('ignore fail', e)
            ignoreSucceed = false
            errorDesc = e
        } finally {
            if (!ignoreSucceed) {
                notify.error('Ignore failed', errorDesc)
            }
        }
    },
    onCollapse(msg) {
        this.collapseLogic.collapseCurrent(this.currentPath)
    },
    onCollapseRootFolder(msg) {
        this.collapseLogic.collapseRoot(this.currentRoot)
    },
    onCollapseOtherFolders(msg) {
        this.collapseLogic.collapseOthers(this.currentPath, this.currentRoot)
    },
    onDispatch(msg) {
        dispatch(configCache.commandToDispatch, this.currentNode)
    },
})
