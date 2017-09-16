'use babel';
/* globals atom */
import path from 'path';
import notify from '../util/notify';
import trash from 'trash';

function onDelete(entryPath) {
    atom.confirm({
        message: `Are you sure you want to delete ${entryPath}?`,
        detailedMessage: `pathToDelete: ${entryPath}`,
        buttons: {
            Delete: async () => deletePath(entryPath),
            Cancel: () => {},
        },
    });
}

async function deletePath(entryPath) {
    const shortPath = path.basename(entryPath);
    try {
        await trash([entryPath]);
    } catch (e) {
        notify.error(`Failed to delete ${shortPath}`, e);
    }
}

export default onDelete;
