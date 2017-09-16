'use babel';

import domUtil from './dom';

export default {
    isFolderNode(node) {
        return domUtil.containClass(node, 'entries')
            || domUtil.containClass(node, 'directory');
    },
    isDirectory(node) {
        return domUtil.containClass(node, 'directory');
    },
    isExpanded(node) {
        return domUtil.containClass(node, 'expanded');
    },
};
