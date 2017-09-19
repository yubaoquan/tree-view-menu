'use babel';

import fs from 'fs';
import path from 'path';

function rename(oldPath, newName) {
    return new Promise((resolve, reject) => {
        try {
            const dirname = path.dirname(oldPath);
            const newPath = path.resolve(dirname, newName);
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        } catch (e) {
            reject(e);
        }
    });
}

export default rename;
