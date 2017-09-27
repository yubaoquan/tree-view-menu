'use babel'

import BasePanel from './BasePanel'
import CheckGroupItem from './CheckGroupItem'

const CheckGroup = {}
CheckGroup.superCreateElement = BasePanel.createElement

export default Object.assign({}, BasePanel, CheckGroup, {
    init(args = {}) {
        this.createElement(args)
        this.inject(args.parent)
    },
    createElement(args) {
        this.superCreateElement({
            extClassName: 'checkGroup',
        })
        args.items.forEach((item) => {
            Object.create(CheckGroupItem)
                .init({
                    ...item,
                    parent: this.element,
                    onCheck: (msg) => {
                        console.info(msg)
                    },
                })
        })
    },
})
