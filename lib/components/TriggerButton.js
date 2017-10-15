'use babel'

import domUtil from '../util/dom'
import BaseButton from './BaseButton'
import { name as packageName } from '../../package.json'

export default Object.assign({}, BaseButton, {
    superEject: BaseButton.eject,
    init(args = {}) {
        const btnEle = document.createElement('button')
        btnEle.textContent = 'menu'
        btnEle.classList = [`${packageName}-btn`]
        Object.assign(btnEle.style, args.style || {})

        this.element = btnEle
        this.updateName(args.name)
        this.element.addEventListener('click', e => {
            e.stopPropagation()
            this.emit('click', {
                node: this.parent,
                path: this.filePath,
                position: {
                    x: this.position.right,
                    y: this.position.top,
                },
            })
        })
        this.handlers = {}
        return this
    },
    inject(node) {
        if (this.parent === node) {
            return
        }
        this.parent = node
        this.filePath = node.children[0].dataset.path
        if (this.relativePosition === 'left') {
            this.markParent()
            node.prepend(this.element)
        } else {
            node.append(this.element)
        }
        this.updatePosition()
    },
    eject() {
        this.unmarkParent()
        this.superEject()
    },
    /**
     * [togglePosition description]
     * @param  {[type]} position left / right
     * @date
     */
    togglePosition(position) {
        this.relativePosition = position
        if (position === 'left') {
            domUtil.addClass(this.element, 'left')
        } else {
            domUtil.removeClass(this.element, 'left')
        }
    },
    markParent() {
        domUtil.addClass(this.parent, 'tree-view-menu-entry')
    },
    unmarkParent() {
        domUtil.removeClass(this.parent, 'tree-view-menu-entry')
    },
})
