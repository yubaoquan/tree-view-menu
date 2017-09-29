'use babel'
import CheckGroupItem from './CheckGroupItem'

export default Object.assign({}, CheckGroupItem, {
    superCreateElement: CheckGroupItem.createElement,
    superGetSelectMsg: CheckGroupItem.getSelectMsg,
    createElement(args) {
        this.superCreateElement(args)
        const editor = document.createElement('input')
        editor.type = 'text'
        this.element.append(editor)
        this.editor = editor
    },
    changeToState(value) {
        this.radio.disabled = !value
        this.editor.disabled = !value
    },
    clear() {
        this.radio.checked = false
        this.editor.value = ''
    },
    getTextValue() {
        return this.editor.value
    },
    activate() {
        this.radio.checked = true
        this.editor.disabled = false
        this.selectCb(this.getSelectMsg())
    },
    getSelectMsg() {
        return Object.assign(this.superGetSelectMsg(), {
            textValue: this.getTextValue(),
            withText: true,
        })
    },
})
