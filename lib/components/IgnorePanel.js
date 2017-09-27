'use babel'

import BasePanel from './BasePanel'
import CheckGroup from './CheckGroup'
import EventMixin from '../mixins/event'


const IgnorePanel = {}
IgnorePanel.superInit = BasePanel.init
IgnorePanel.superCreateElement = BasePanel.createElement

export default Object.assign({}, EventMixin, BasePanel, IgnorePanel, {
    init(args = {}) {
        this.superInit({ extClassName: 'ignore' })
        this.addIgnoreOptions()
        this.currentPath = ''
        this.addFooter()
        return this
    },
    addIgnoreOptions() {
        Object.create(CheckGroup)
            .init({
                parent: this.element,
                items: [
                    {
                        radioName: 'ignore',
                        title: 'Ignore this file',
                        value: 0,
                    }, {
                        radioName: 'ignore',
                        title: 'Ignore all files under this folder',
                        value: 1,
                    }, {
                        radioName: 'ignore',
                        title: `Ignore all files matching this file's suffix`,
                        value: 2,
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
        if (cfg.entryName != null) {
            this.currentPath = cfg.entryName
        }
    },
    show(msg) {
        this.panel.show()
        this.updatePosition(msg.position)
    },
})
