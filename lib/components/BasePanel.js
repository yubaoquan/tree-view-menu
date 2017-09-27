'use babel'
/* global atom */

import domUtil from '../util/dom'
import { name as packageName } from '../../package.json'
import BaseButton from './Basebutton'
import BaseElement from './BaseElement'
import { doNothing } from '../util/util'

export default Object.assign({}, BaseElement, {
    init(args) {
        this.createElement(args)
        this.createPanel(args)
        this.addCloseButton(args)
    },
    createElement() {
        this.element = document.createElement('div')
        this.element.classList.add(`${packageName}-panel`)
    },
    createPanel(args = {}) {
        this.panel = atom.workspace.addModalPanel({
            item: this.getElement(),
            visible: false,
        })
        this.wrapper = this.panel.element
        let className = `${packageName}-panel-container`
        if (args.extClassName) {
            className += ` ${className}-${args.extClassName}`
        }
        domUtil.addClass(this.wrapper, className)
    },
    addCloseButton() {
        const header = document.createElement('header')
        header.className = `${packageName}-panel-header`
        this.buttonClose = Object.create(BaseButton).init({
            name: '×',
            parentNode: header,
            className: `${packageName}-panel-close-btn`,
            onClick: () => {
                this.close()
            },
        })
        this.element.append(header)
    },
    show() {
        this.panel.show()
    },
    hide() {
        this.panel.hide()
    },
    updatePosition(position) {
        this.wrapper.style.left = position.x + 'px'
        const wrapperHeight = this.wrapper.offsetHeight
        let y
        if (position.y + wrapperHeight > window.outerHeight) {
            y = position.y - wrapperHeight
        } else {
            y = position.y
        }
        this.wrapper.style.top = y + 'px'
        this.position = {
            x: position.x,
            y,
        }
    },
    getPosition() {
        return this.position
    },
    close() {
        this.emit('close')
        this.hide()
    },
    addFooter(args) {
        this.confirmCb = args.onConfirm || doNothing
        const footer = document.createElement('footer')
        footer.className = `${packageName}-panel-footer`
        this.confirmBtn = Object.create(BaseButton)
            .init({
                parentNode: footer,
                className: `${packageName}-btn footer`,
                name: 'confirm',
                onClick: () => {
                    this.onConfirm()
                },
            })
        this.cancelBtn = Object.create(BaseButton)
            .init({
                parentNode: footer,
                className: `${packageName}-btn footer`,
                name: 'cancel',
                onClick: () => {
                    this.close()
                },
            })
        this.element.append(footer)
    },
})
