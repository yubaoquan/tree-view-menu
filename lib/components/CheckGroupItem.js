'use babel'
import BaseElement from './BaseElement'

export default Object.assign({}, BaseElement, {
    init(args = {}) {
        this.createElement(args)
        this.initEvent()
        this.inject(args.parent)
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
        pathEditInput.type = 'text'

        label.append(radio)
        label.append(span)

        this.radio = radio
        this.label = label
        this.element.append(label)
        // this.element.append(pathEditInput)
    },
    initEvent() {
        this.label.addEventListener('click', (e) => {
            console.info(e)
        })
    },
})
