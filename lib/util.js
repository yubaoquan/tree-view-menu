'use babel';

export default {
    containClass(node = {}, className) {
        const classList = node.classList || [];
        return classList.contains(className);
    },
    isFolderNode(node) {
        return this.containClass(node, 'entries')
            || this.containClass(node, 'directory');
    },
    isDirectory(node) {
        return this.containClass(node, 'directory');
    },
    isExpanded(node) {
        return this.containClass(node, 'expanded');
    },
    push(list, item) {
        [].push.call(list, item);
    },
    addClass(node, className) {
        node.className = `${node.className} ${className}`;
    },
    isParent(node1, node2) {
        return node2.parentNode === node1;
    },
    inPosition(point, rect) {
        if (point.x < rect.left || point.x > rect.right) {
            return false;
        }
        if (point.y < rect.top || point.y > rect.bottom) {
            return false;
        }
        return true;
    },
};
