'use babel';
/* global atom */
import path from 'path';
import notify from '../util/notify';

function copy(value, name) {
    atom.clipboard.write(value);
    notify.success(`${name} copied!`);
}

export default {
    copyFullPath(fullPath) {
        copy(fullPath, 'Full path');
    },
    copyProjectPath(fullPath) {
        const relativePath = atom.project.relativizePath(fullPath)[1];
        copy(relativePath, 'Project path');
    },
    copyEntryName(fullPath) {
        const arr = fullPath.split(path.sep);
        const entryName = arr[arr.length - 1];
        copy(entryName, 'Name');
    },
    copyEntry() {

    },
    pasteEntry() {

    },
};
