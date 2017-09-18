'use babel';

const buttons = [
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
        value: 'cut',
        description: 'Cut',
    }, {
        value: 'paste',
        description: 'Paste',
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
        value: 'close',
        description: 'Close File Panel If Opened',
    },
];

const menuBtns = {};
buttons.forEach((btn, index) => {
    menuBtns[btn.value] = {
        order: index + 2,
        type: 'boolean',
        description: btn.description,
        default: false,
    };
});

export default {
    mode: 'callMenu',
    modes: [
        {
            value: 'singleButton',
            description: 'Single Button',
        }, {
            value: 'callMenu',
            description: 'Call Menu',
        },
    ],
    buttons: buttons,
    singleButtonTypes: buttons.slice(0),
    menuBtns: menuBtns,
};
