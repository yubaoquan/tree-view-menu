'use babel'

import BasePanel from './BasePanel'
import CheckGroupItem from './CheckGroupItem'

const CheckGroup = {}
CheckGroup.superCreateElement = BasePanel.createElement

export default Object.assign({}, BasePanel, CheckGroup, {
    init(args = {}) {
        this.createElement(args)
        this.inject(args.parent)
        return this
    },
    createElement(args) {
        this.superCreateElement({
            extClassName: 'checkGroup',
        })
        this.items = args.items.map((item) => {
            return Object.create(CheckGroupItem)
                .init({
                    ...item,
                    parent: this.element,
                })
        })
    },
    getValue() {
        const checked = this.element.querySelector('input[type=radio]:checked')
        return checked.value
    },
    enableItems(indexes) {
        indexes.forEach((index) => {
            this.items[index].enable(true)
        })
    },
    disableItems(indexes) {
        indexes.forEach((index) => {
            this.items[index].enable(false)
        })
    },
    enableItem(index) {
        this.items[index].enable(true)
    },
    disableItem(index) {
        this.items[index].enable(false)
    },
    clear() {
        this.items.forEach((item) => {
            item.clear()
        })
    },
    checkFirst() {
        let found = false
        this.items.forEach((item) => {
            if (!found && item.isEditable()) {
                item.check()
                found = true
            }
        })
    },
})
