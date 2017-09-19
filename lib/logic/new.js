'use babel';

import fs from 'fs';
import path from 'path';

export default {
    createFile(pathname) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(pathname)) {
                return reject('File exists');
            }
            try {
                fs.open(pathname, 'w', (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    createFolder(pathname) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(pathname)) {
                return reject('Folder exists');
            }
            try {
                fs.mkdir(pathname, 'w', (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    },
};
