'use babel'

import BasePanel from './BasePanel'
import CheckGroupItem from './CheckGroupItem'
import CheckGroupItemWithInput from './CheckGroupItemWithInput'

export default Object.assign({}, BasePanel, {
    superCreateElement: BasePanel.createElement,
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
            let GroupItemKind = CheckGroupItem
            if (item.hasEditor) {
                GroupItemKind = CheckGroupItemWithInput
            }
            return Object.create(GroupItemKind)
                .init({
                    ...item,
                    parent: this.element,
                    onSelect: (value) => {
                        this.value = value
                    },
                })
        })
    },
    getValue() {
        let text = ''
        if (this.value.withText) {
            text = this.value.radioItem.getTextValue()
        }
        return {
            value: this.value.value,
            text,
        }
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
