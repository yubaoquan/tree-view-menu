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
            this.items[index].enable()
        })
    },
    disableItems(indexes) {
        indexes.forEach((index) => {
            this.items[index].disable()
        })
    },
    enableItem(index) {
        this.items[index].changeToState(true)
    },
    selectItemOfValue(value) {
        this.items.forEach((item) => {
            item.changeToState(item.getValue() === value)
        })
    },
    enableItemOfValue(value) {
        this.setItemCheckableStateIfValueIs(value, true)
    },
    disableItemOfValue(value) {
        this.setItemCheckableStateIfValueIs(value, false)
    },
    setItemCheckableStateIfValueIs(radioValue, state) {
        this.items.forEach((item) => {
            if (item.getValue() === radioValue) {
                item.changeToState(state)
            }
        })
    },
    disableItem(index) {
        this.items[index].changeToState(false)
    },
    clear() {
        this.items.forEach((item) => {
            item.clear()
        })
    },
    selectFirst() {
        let found = false
        this.items.forEach((item) => {
            if (!found && item.isEditable()) {
                item.activate()
                found = true
            }
        })
    },
})
