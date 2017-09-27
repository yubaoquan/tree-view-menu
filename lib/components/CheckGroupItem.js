'use babel'
import BaseElement from './BaseElement'

export default Object.assign({}, BaseElement, {
    init(args = {}) {
        this.createElement(args)
        // this.initEvent(args)
        this.inject(args.parent)
        return this
    },
    createElement(args) {
        const div = document.createElement('div')
        this.element = div
        div.className = 'checkGroupItem'
        const label = document.createElement('label')
        const span = document.createElement('span')
        const radio = document.createElement('input')
        const pathEditInput = document.createElement('input')

        span.textContent = args.title
        radio.type = 'radio'
        radio.name = args.radioName
        radio.value = args.value
        radio.checked = args.checked
        pathEditInput.type = 'text'

        label.append(radio)
        label.append(span)

        this.radio = radio
        this.label = label
        this.element.append(label)
        // this.element.append(pathEditInput)
    },
    initEvent(args) {
        this.label.addEventListener('click', (e) => {
            if (args.onCheck) {
                args.onCheck(e)
            }
        })
    },
    enable(value) {
        this.radio.disabled = !value
    },
    clear() {
        this.radio.checked = false
    },
    isEditable() {
        return !this.radio.disabled
    },
    check() {
        this.radio.checked = true
    },

})
