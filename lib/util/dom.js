'use babel'

function containClass(node = {}, className) {
    const classList = node.classList || []
    return classList.contains(className)
}
export default {
    containClass,
    addClass(node, className) {
        if (!containClass(node, className)) {
            node.className = `${node.className} ${className}`
        }
    },
    removeClass(node, className) {
        if (node && node.classList) {
            node.classList.remove(className)
        }
    },
    isParent(node1, node2) {
        return node2.parentNode === node1
    },
    inPosition(point, rect) {
        if (!rect) {
            return false
        }
        if (point.x < rect.left || point.x > rect.right) {
            return false
        }
        if (point.y < rect.top || point.y > rect.bottom) {
            return false
        }
        return true
    },

}
