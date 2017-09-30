'use babel'

import _ from './util/util'

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
        description: 'Duplicate current file or folder',
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
        description: 'Close opened panel of current file',
    }, {
        value: 'findAndReplace',
        description: 'Call `Find and replace` panel in current file',
    }, {
        value: 'searchInDirectory',
        description: 'Call `Search in directory` panel in current folder',
    }, {
        value: 'ignore',
        desription: 'Ignore operation of git',
    }, {
        value: 'collapseRootFolder',
        description: 'Collapse root folder',
    }, {
        value: 'collapseOtherFolders',
        description: 'Collapse other folders',
    }, {
        value: 'collapse',
        description: 'Collapse current folder',
    }, {
        value: 'dispatch',
        description: 'Dispatch a command from current file or folder (the command is value of `Command To Dispatch`)',
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
    menuBtns: menuBtns,
    singleButtonTypes: buttons.map((btn) => {
        return {
            value: btn.value,
            description: _.getBtnNameFromSmallCamel(btn.value),
        }
    }),
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
        custom: {
            value: 6,
            executableOnFile: true,
            executableOnFolder: true,
        },
    },
}
