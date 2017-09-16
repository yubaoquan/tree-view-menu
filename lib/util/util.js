'use babel';

import fs from 'fs';
import notify from './notify';

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
};
