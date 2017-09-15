'use babel';

export default {
    containClass(node, className) {
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
};
