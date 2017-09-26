'use babel';
/* global atom */
import fs from 'fs';
import path from 'path';
import notify from './notify';
import isGitRepo from 'is-git-repository';

export default {
    push(list, item) {
        [].push.call(list, item);
    },
    isDirectory(pathName) {
        return new Promise((resolve, reject) => {
            fs.lstat(pathName, (err, stat) => {
                if (err) {
                    notify.error('Error getting path type', err);
                    return resolve(false);
                }
                resolve(stat.isDirectory());
            });
        });
    },
    isDirectorySync(pathname) {
        return fs.lstatSync(pathname).isDirectory();
    },
    camelShift(str, small2Big) {
        if (!str) {
            return str;
        }
        const firstLetter = str[0];
        const restLetters = str.slice(1);
        if (small2Big) {
            return firstLetter.toUpperCase() + restLetters;
        }
        return firstLetter.toLowerCase() + restLetters;
    },
    getBtnNameFromSmallCamel(str) {
        if (!str) {
            return '';
        }
        const bigCamel = this.camelShift(str, true);
        const words = [];
        let word = '';
        for (const letter of bigCamel) {
            if (/[a-z]/.test(letter)) {
                word += letter;
            } else {
                words.push(word);
                word = letter;
            }
        }
        words.push(word);
        return words.join(' ');
    },
    closeEntryPane(path) {
        atom.workspace.getTextEditors()
            .forEach((pane) => {
                if (path === pane.getPath()) {
                    pane.destroy();
                }
            });
    },
    getEntryName(fullPath) {
        const arr = fullPath.split(path.sep);
        return arr[arr.length - 1];
    },
    getNewPath4Create(oldPath, newName) {
        if (this.isDirectorySync(oldPath)) {
            return path.join(oldPath, newName);
        }
        return this.getNewPath4Rename(oldPath, newName);
    },
    getNewPath4Rename(oldPath, newName) {
        const dirname = path.dirname(oldPath);
        return path.join(dirname, newName);
    },
    getClosestDir(pathname) {
        if (this.isDirectorySync(pathname)) {
            return pathname;
        }
        return path.dirname(pathname);
    },
    isGitRepo(pathname) {
        return isGitRepo(pathname);
    },
};
