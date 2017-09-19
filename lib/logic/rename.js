'use babel';

import fs from 'fs';

function rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        try {
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
}

export default rename;
