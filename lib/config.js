'use babel'
import constants from './constant'

let currentOrder = Object.keys(constants.menuBtnCfg).length + 2
export default {
    mode: {
        order: 1,
        type: 'string',
        default: 'callMenu',
        enum: constants.modes,
        description: '`Single Button` mode, only a functional button avaiable, `Call Menu` mode, can call a menu with buttons you select below.',
    },
    ...constants.menuBtnCfg,
    singleButtonType: {
        order: currentOrder++,
        type: 'string',
        default: 'newFile',
        enum: constants.singleButtonTypes,
        description: 'Button type for `Single Button` mode.',
    },
    askForSureBeforeDelete: {
        order: currentOrder++,
        type: 'boolean',
        default: true,
        description: 'Let user to confirm again before delete file or folder',
    },
    commandToDispatch: {
        order: currentOrder++,
        type: 'string',
        default: '',
        description: 'Command to dispatch when click on `dispatch` button, avaiable commands is the key of `atom.commands.registeredCommands`',
    },
    menuWidth: {
        order: currentOrder++,
        type: 'number',
        default: 0,
        description: 'Width of the menu in px',
    },
    menuHeight: {
        order: currentOrder++,
        type: 'number',
        default: 0,
        description: 'Height of the menu in px',
    },
    menuButtonWidth: {
        order: currentOrder++,
        type: 'number',
        default: 0,
        description: 'Width of buttons in menu panel',
    },
    keepSearchTextAfterSearch: {
        order: currentOrder++,
        type: 'boolean',
        default: false,
        description: 'Keep the text in input after searching the text',
    },
}
