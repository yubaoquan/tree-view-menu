'use babel'

import BaseElement from './BaseElement'
import EventMixin from '../mixins/event'

export default Object.assign({}, BaseElement, EventMixin, {
    init(config) {
        const element = document.createElement('button')
        element.textContent = config.name || 'button'
        element.className = config.className || ''
        element.style = config.style || {}
        if (config.id) {
            element.id = config.id
        }
        this.element = element
        if (config.parentNode) {
            this.inject(config.parentNode)
        }
        this.clickhandlers = []
        this.element.addEventListener('click', e => {
            this.clickhandlers.forEach(handler => {
                handler(e)
            })
        })
        if (config.onClick) {
            this.onClick(config.onClick)
        }
        return this
    },
    onClick(handler) {
        this.clickhandlers.push(handler)
    },
    getPosition() {
        return this.position
    },
    updateName(name) {
        this.element.textContent = name
    },
})
