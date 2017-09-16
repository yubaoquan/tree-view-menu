'use babel';

export default {
    mode: [
        {
            value: 'singleButton',
            description: 'Single Button',
        }, {
            value: 'callMenu',
            description: 'Call Menu',
        },
    ],
    buttons: [
        {
            value: 'newFile',
            description: 'New File',
        }, {
            value: 'newFolder',
            description: 'New Folder',
        }, {
            value: 'rename',
            description: 'Rename',
        }, {
            value: 'delete',
            description: 'Delete',
        }, {
            value: 'copy',
            description: 'Copy',
        }, {
            value: 'paste',
            description: 'Paste',
        }, {
            value: 'cut',
            description: 'Cut',
        }, {
            value: 'duplicate',
            description: 'Duplicate',
        }, {
            value: 'copyName',
            description: 'Copy File/Folder Name',
        }, {
            value: 'copyProjectPath',
            description: 'Copy File/Folder\'s Project Path',
        }, {
            value: 'copyFullPath',
            description: 'Copy File/Folder\'s Full Path',
        }, {
            value: 'closePane',
            description: 'Close File Panel If Opened',
        },
    ],
};
