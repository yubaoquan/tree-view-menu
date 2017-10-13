'use babel'

import BasePanel from './BasePanel'
import EventMixin from '../mixins/event'

export default Object.assign({}, EventMixin, BasePanel, {
    init(args = {}) {
        this.createElement(args)
        this.createPanel({ extClassName: 'rename' })
        this.addCloseButton()
        this.addSections(args)
        return this
    },
    addSections(args) {
        const inputWrapper = document.createElement('section')
        this.addInput(inputWrapper)
        this.element.append(inputWrapper)
        this.addFooter(args)
    },
    addInput(node) {
        const input = document.createElement('input')
        input.type = 'text'
        node.append(input)
        input.className = 'native-key-bindings input'
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                this.onConfirm()
            }
        })
        this.input = input
    },

    show() {
        this.panel.show()
        this.input.focus()
    },
    onConfirm() {
        this.confirmCb({
            value: this.input.value,
            type: this.type,
        })
        this.hide()
    },
    update(cfg) {
        if (cfg.position) {
            this.updatePosition(cfg.position)
        }
        if (cfg.text != null) {
            if (cfg.type === 'rename') {
                this.updateValue(cfg.text)
            } else {
                this.updateText(cfg.text)
            }
        }
        if (cfg.type) {
            this.type = cfg.type
        }
    },
    // used in rename operation
    updateValue(value) {
        this.updateText(value)
        let dotPos = this.value.lastIndexOf('.')
        if (dotPos === -1) {
            dotPos = this.value.length
        }
        this.input.setSelectionRange(0, dotPos)
    },
    updateText(text) {
        this.value = text
        this.input.value = text
    },
    updateType(type) {
        this.type = type
    },
    reset() {
        this.input.value = this.value
    },
})
