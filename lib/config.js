'use babel'
import constants from './constant'

const buttonAmount = constants.buttons.length
export default {
    mode: {
        order: 1,
        type: 'string',
        default: 'callMenu',
        enum: constants.modes,
        description: '`Single Button` mode, only a functional button avaiable, `Call Menu` mode, can call a menu with buttons you select below.',
    },
    ...constants.menuBtns,
    singleButtonType: {
        order: buttonAmount + 2,
        type: 'string',
        default: 'newFile',
        enum: constants.singleButtonTypes,
        description: 'Button type for `Single Button` mode.',
    },
    askForSureBeforeDelete: {
        order: buttonAmount + 3,
        type: 'boolean',
        default: true,
        description: 'Let user to confirm again before delete file or folder',
    },
    commandToDispatch: {
        order: buttonAmount + 4,
        type: 'string',
        default: '',
        description: 'Command to dispatch when click on `dispatch` button, avaiable commands is the key of `atom.commands.registeredCommands`',
    },
}
