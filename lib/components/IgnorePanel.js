'use babel'

import BasePanel from './BasePanel'
import CheckGroup from './CheckGroup'
import EventMixin from '../mixins/event'
import _ from '../util/util'

const IgnorePanel = {}
IgnorePanel.superInit = BasePanel.init
IgnorePanel.superCreateElement = BasePanel.createElement

export default Object.assign({}, EventMixin, BasePanel, IgnorePanel, {
    init(args = {}) {
        this.superInit({ extClassName: 'ignore' })
        this.addIgnoreOptions()
        this.currentPath = ''
        this.addFooter(args)
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
                        value: 0,
                    }, {
                        radioName: 'ignore',
                        title: `Ignore all files with the same suffix`,
                        value: 1,
                    }, {
                        radioName: 'ignore',
                        title: 'Ignore everything inside this folder',
                        value: 2,
                    }, {
                        radioName: 'ignore',
                        title: 'Ignore all folder with the same name',
                        value: 3,
                    }, {
                        radioName: 'ignore',
                        title: 'Ignore all files and folders with the same name(include suffix)',
                        value: 4,
                    },
                ],
                onSelect: (msg) => {
                    console.info(msg)
                },
            })
    },
    update(cfg) {
        if (cfg.position) {
            this.updatePosition(cfg.position)
        }
        this.ignoreSelector.clear()
        if (_.isDirectorySync(cfg.pathname)) {
            this.ignoreSelector.disableItems([0, 1])
            this.ignoreSelector.enableItem(2)
        } else {
            this.ignoreSelector.enableItems([0, 1])
            this.ignoreSelector.disableItem(2)
        }
        this.ignoreSelector.checkFirst()
    },
    show(msg) {
        this.panel.show()
        this.updatePosition(msg.position)
    },
    onConfirm() {
        const ignoreType = this.ignoreSelector.getValue()
        this.confirmCb(ignoreType)
        this.hide()
    },
})
