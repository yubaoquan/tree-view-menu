'use babel'

import BaseButton from './BaseButton'
import { name as packageName } from '../../package.json'

export default Object.assign({}, BaseButton, {
    init(args = {}) {
        const btnEle = document.createElement('button')
        btnEle.textContent = 'menu'
        btnEle.classList = [`${packageName}-btn`]
        Object.assign(btnEle.style, args.style || {})

        this.element = btnEle
        this.updateName(args.name)
        this.element.addEventListener('click', (e) => {
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
        this.parent = node
        node.append(this.element)
        this.filePath = node.children[0].dataset.path
        this.updatePosition()
    },
})
