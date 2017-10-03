'use babel'

import BaseButton from './BaseButton'
import EventMixin from '../mixins/event'

export default Object.assign({}, BaseButton, EventMixin, {
    init(config) {
        const element = document.createElement('button')
        element.className = config.className || ''
        element.style = config.style || {}
        const title = document.createElement('span')
        title.className = 'btn-title'
        title.textContent = config.name || 'button'
        element.title = title.textContent
        this.title = title
        element.append(title)
        if (config.id) {
            element.id = config.id
        }
        this.element = element
        if (config.parentNode) {
            this.inject(config.parentNode)
        }
        this.clickhandlers = []
        this.element.addEventListener('click', (e) => {
            this.clickhandlers.forEach((handler) => {
                handler(e)
            })
        })
        if (config.onClick) {
            this.onClick(config.onClick)
        }
        return this
    },
    updateName(name) {
        this.title.textContent = name
    },
    updateWidth(width) {
        if (width) {
            this.element.style.width = `${width}px`
            this.title.style.overflow = 'hidden'
        } else {
            this.element.style.width = 'auto'
            this.title.style.overflow = 'visible'
        }
    },
})
