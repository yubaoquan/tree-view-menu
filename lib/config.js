'use babel'

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
        description: 'Copy Project Path',
    }, {
        value: 'copyFullPath',
        description: 'Copy Full Path',
    }, {
        value: 'closePane',
        description: 'Close Panel',
    }, {
        value: 'findAndReplace',
        description: 'Find And Replace',
    }, {
        value: 'searchInDirectory',
        description: 'Search in directory',
    }, {
        value: 'ignore',
        desription: 'Ignore operation of git',
    },
]

const menuBtns = {}
buttons.forEach((btn, index) => {
    menuBtns[btn.value] = {
        order: index + 2,
        type: 'boolean',
        description: btn.description,
        default: false,
    }
})

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
    ignoreTypes: {
        ignoreSpecificFile: {
            value: 0,
            executableOnFile: true,
            executableOnFolder: false,
        },
        ignoreBySuffix: {
            value: 1,
            executableOnFile: true,
            executableOnFolder: false,
        },
        ignoreSpecificFolder: {
            value: 3,
            executableOnFile: false,
            executableOnFolder: true,
        },
        ignoreFolderWithSameName: {
            value: 4,
            executableOnFile: false,
            executableOnFolder: true,
        },
        ignoreSameName: {
            value: 5,
            executableOnFile: true,
            executableOnFolder: true,
        },
    },
}
