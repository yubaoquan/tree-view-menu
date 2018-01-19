'use babel'

import BasePanel from './BasePanel'
import CheckGroup from './CheckGroup'
import EventMixin from '../mixins/event'
import _ from '../util/util'
import notify from '../util/notify'
import { ignoreTypes } from '../constant'

export default Object.assign({}, EventMixin, BasePanel, {
    superInit: BasePanel.init,
    superCreateElement: BasePanel.createElement,
    init(args = {}) {
        this.superInit({ extClassName: 'ignore' })
        this.addIgnoreOptions()
        this.currentPath = ''
        this.addFooter(args)
        this.listenBlur()
        return this
    },
    addIgnoreOptions() {
        this.ignoreSelector = Object.create(CheckGroup)
            .init({
                parent: this.element,
                items: [
                    {
                        checked: true,
                        radioName: 'ignore',
                        title: 'Ignore this file',
                        value: ignoreTypes.ignoreSpecificFile.value,
                    }, {
                        radioName: 'ignore',
                        title: `Ignore all files with the same suffix`,
                        value: ignoreTypes.ignoreBySuffix.value,
                    }, {
                        radioName: 'ignore',
                        title: 'Ignore everything inside this folder',
                        value: ignoreTypes.ignoreSpecificFolder.value,
                    }, {
                        radioName: 'ignore',
                        title: 'Ignore all folder with the same name',
                        value: ignoreTypes.ignoreFolderWithSameName.value,
                    }, {
                        radioName: 'ignore',
                        title: 'Ignore all files and folders with the same name(include suffix)',
                        value: ignoreTypes.ignoreSameName.value,
                    }, {
                        radioName: 'ignore',
                        title: 'Custom',
                        value: ignoreTypes.custom.value,
                        hasEditor: true,
                    },
                ],
                onSelect: msg => {
                    this.value = msg
                },
            })
    },
    update(cfg) {
        if (cfg.position) {
            this.updatePosition(cfg.position)
        }
        this.ignoreSelector.clear()
        const isDirectory = _.isDirectorySync(cfg.pathname)
        Object.getOwnPropertyNames(ignoreTypes).forEach(prop => {
            const ignoreType = ignoreTypes[prop]
            if (isDirectory && ignoreType.executableOnFolder) {
                this.ignoreSelector.enableItemOfValue(ignoreType.value)
            } else if (!isDirectory && ignoreType.executableOnFile) {
                this.ignoreSelector.enableItemOfValue(ignoreType.value)
            } else {
                this.ignoreSelector.disableItemOfValue(ignoreType.value)
            }
        })
        this.ignoreSelector.selectFirst()
    },
    show(msg) {
        this.panel.show()
        this.updatePosition(msg.position)
    },
    onConfirm() {
        const { value, text } = this.ignoreSelector.getValue()
        const ignoreType = value
        const customText = text
        if (ignoreType === ignoreTypes.custom.value && !customText) {
            return notify.error('Please input ignore config text')
        }
        this.confirmCb({ ignoreType, customText })
        this.hide()
    },
})
