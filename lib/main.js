'use babel'
/* globals atom */
import Menu from './components/Menu'
import NameEditor from './components/NameEditor'
import TriggerButton from './components/TriggerButton'
import { CompositeDisposable } from 'atom'
import _ from './util/util'
import treeViewUtil from './util/tree-view'
import domUtil from './util/dom'
import deleteEntry from './logic/delete'
import config from './config'
import { name as packageName } from '../package.json'
import {
    createFile,
    createFolder,
} from './logic/new'
import copyPaste from './logic/copyPaste'
import rename from './logic/rename'
import notify from './util/notify'
import findAndReplace from './logic/findAndReplace'
import ignoreLogic from './logic/ignore'
import IgnorePanel from './components/IgnorePanel'

export default Object.assign({}, {
    config: {
        ...config.menuBtns,
        mode: {
            order: 1,
            type: 'string',
            default: 'callMenu',
            enum: config.modes,
            description: '`Single Button` mode, only a functional button avaiable, `Call Menu` mode, can call a menu with buttons you select below.',
        },
        singleButtonType: {
            order: config.singleButtonTypes.length + 2,
            type: 'string',
            default: 'newFile',
            enum: config.singleButtonTypes,
            description: 'Button type for `Single Button` mode.',
        },
        askForSureBeforeDelete: {
            order: config.singleButtonTypes.length + 3,
            type: 'boolean',
            default: true,
            description: 'Let user to confirm again before delete file or folder',
        },
    },
    Menu: null,
    modalPanel: null,
    subscriptions: null,
    treeViewItemSelector: '.list-tree .list-item',
    treeViewFileSelector: '.list-tree .entry.file',
    observeConfig() {
        Object.keys(this.config).forEach((key) => {
            atom.config.observe(`${packageName}.${key}`, (value) => {
                config[key] = value
                if (key === 'mode') {
                    this.updateMode(value)
                }
                if (key === 'singleButtonType') {
                    this.updateTriggerBtnName()
                }
                if (config.buttons.some((btn) => {
                    return btn.value === key
                })) {
                    this.updateMenu(key, value)
                }
            })
        })
    },
    updateMode() {
        this.updateTriggerBtnName()
        this.menu.hide()
    },
    updateMenu(btnName, enable) {
        if (enable) {
            return this.menu.addButton(btnName)
        }
        this.menu.removeButton(btnName)
    },
    async activate(state) {
        const getTreeViewSuccess = await this.getTreeView()
        if (!getTreeViewSuccess) {
            return
        }
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
        this.copyTool.on('ok', (e) => {
            this.updateListeningList(true)
        })
        this.activated = true
    },
    async getTreeView() {
        try {
            const treeViewPkg = await atom.packages.activatePackage('tree-view')
            if (treeViewPkg.mainModule.createView) {
                this.treeView = treeViewPkg.mainModule.createView()
            } else {
                this.treeView = treeViewPkg.mainModule.getTreeViewInstance()
            }
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    },
    listenEntryClick() {
        this.originEntryClicked = this.treeView.entryClicked.bind(this.treeView)
        this.treeView.entryClicked = (e) => {
            const entry = e.target.closest('.entry')
            if (!entry || !treeViewUtil.isDirectory(entry)) {
                return this.originEntryClicked(e)
            }
            this.originEntryClicked(e)
            if (treeViewUtil.isExpanded(entry)) {
                this.mount2Node(entry)
            }
        }
        this.treeView.onFileCreated((e) => {
            this.updateListeningList(true)
        })
        this.treeView.onDirectoryCreated((e) => {
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
        this.button.on('click', (msg) => {
            this.onTriggerButtonClicked(msg)
        })
    },
    initNameEditor() {
        this.nameEditor = Object.create(NameEditor)
            .init({
                onConfirm: (msg) => {
                    this.onNameEditorConfirm(msg)
                },
            })
    },
    getTriggerBtnName() {
        switch (config.mode) {
            case 'callMenu': return 'menu'
            case 'singleButton':
                return _.getBtnNameFromSmallCamel(config.singleButtonType)
            default:
                console.error('invalid mode:', config.mode)
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
        switch (config.mode) {
            case 'callMenu':
                return this.triggerInCallMenuMode(msg)
            case 'singleButton':
                return this.triggerInSingleBtnMode(msg)
            default:
                console.error('invalid mode:', config.mode)
        }
    },
    triggerInCallMenuMode(msg) {
        this.menu.show(msg.position)
    },
    initMenu() {
        this.menu = Object.create(Menu).init()
        config.buttons.forEach((btn) => {
            const btnValue = btn.value
            const methodName = 'on' + _.camelShift(btnValue, true)
            this.menu.on(btnValue, (msg) => {
                this[methodName](msg)
                this.menu.hide()
            })
        })
    },
    initIgnorePanel() {
        this.ignorePanel = Object.create(IgnorePanel)
            .init({
                onConfirm: (msg) => {
                    this.onIgnoreConfirm(msg)
                },
            })
    },
    triggerInSingleBtnMode(msg) {
        const methodName = 'on' + _.camelShift(config.singleButtonType, true)
        this[methodName](msg)
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
            this.treeView.roots.forEach((root) => {
                const pathNode = root.querySelector('[data-path]')
                if (!pathNode) {
                    notify.error('Project root node not found!')
                    return
                }
                this.mount2Node(root, pathNode.dataset.path)
            })
        }, timeout)
    },
    mount2Node(node, rootPath) {
        node.dataset.root = rootPath
        const children = Array.from(node.children || [])
        children.forEach((child) => {
            if (
                domUtil.containClass(child, 'list-item') &&
                !this.inListeningList(child)
            ) {
                child.addEventListener('mouseover', (e) => {
                    this.showButton(child)
                })
                child.addEventListener('mouseout', (e) => {
                    this.onMouseOut(e, child)
                })
                child.dataset.root = rootPath
                this.add2ListeningList(child)
            }
            if (treeViewUtil.isFolderNode(child)) {
                this.mount2Node(child, rootPath)
            }
        })
    },
    inListeningList(node) {
        return node.dataset.treeViewFrequentMenu === '1'
    },
    add2ListeningList(node) {
        node.dataset.treeViewFrequentMenu = '1'
    },
    showButton(node) {
        if (this.died) {
            return
        }
        this.button.inject(node)
    },
    onMouseOut(e, hostNode) {
        if (domUtil.inPosition({
            x: e.pageX,
            y: e.pageY,
        }, this.button.getPosition())) {
            return
        }
        this.hideButton(hostNode)
    },
    hideButton(node) {
        if (this.died) {
            return
        }
        this.button.eject(node)
    },
    // on menu buttons click
    onNewFile(msg) {
        this.nameEditor.update({
            entryName: '',
            position: msg.position,
            type: 'newFile',
        })
        this.nameEditor.show()
    },
    onNewFolder(msg) {
        this.nameEditor.update({
            entryName: '',
            position: msg.position,
            type: 'newFolder',
        })
        this.nameEditor.show()
    },
    onFindAndReplace() {
        const node = this.currentNode
        if (_.isDirectorySync(this.currentPath)) {
            notify.error(`Can't do find and replace to a folder`)
            return
        }
        this.findAndReplace.findAndReplace(node, this.currentPath)
    },
    onSearchInDirectory() {
        const node = this.currentNode.parentNode
        // const rootPath = node.dataset.root
        this.findAndReplace.findInProject(node, this.currentPath, this.currentRoot)
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
            entryName: this.currentPath,
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
        deleteEntry(this.currentPath, config.askForSureBeforeDelete)
    },
    closePane() {
        _.closeEntryPane(this.currentPath)
    },
    onRename(msg) {
        const entryName = _.getEntryName(this.currentPath)
        this.nameEditor.update({
            position: msg.position,
            entryName: entryName,
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
    async onIgnore(msg) {
        let targetType = 'file'
        if (_.isDirectorySync(this.currentPath)) {
            targetType = 'folder'
        }
        if (!ignoreLogic.isInGitRepo(this.currentPath, this.currentRoot)) {
            notify.error(`This ${targetType} is not in a git repository.`)
            return
        }
        console.info(this.currentPath)
        const isRoot = await ignoreLogic.isRepoRoot(this.currentPath)
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
    async onIgnoreConfirm(ignoreType) {
        let ignoreSucceed = false
        try {
            ignoreSucceed = await ignoreLogic.ignore(this.currentPath, ignoreType)
        } catch (e) {
            ignoreSucceed = false
        } finally {
            if (!ignoreSucceed) {
                notify.error('Ignore failed')
            }
        }
    },
})
