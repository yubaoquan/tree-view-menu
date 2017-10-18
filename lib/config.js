'use babel'
import constants from './constant'
import { platform } from 'os'

let currentOrder = Object.keys(constants.menuBtnCfg).length + 3
const osType = platform()
let defaultTerminalApp
switch (osType) {
    case 'darwin':
        defaultTerminalApp = 'Terminal.app'
        break
    case 'win32':
        defaultTerminalApp = 'C:\\Windows\\System32\\cmd.exe'
        break
    default:
        defaultTerminalApp = '/usr/bin/x-terminal-emulator'

}
const config = {
    buttonPosition: {
        order: 1,
        type: 'string',
        default: 'right',
        enum: constants.triggerBtnPosition,
        description: 'Show the button on left or right side to the file/folder',
    },
    mode: {
        order: 2,
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
    terminalApp: {
        type: 'string',
        default: defaultTerminalApp,
        description: 'App to execute terminal commands',
    },
    terminalArgs: {
        type: 'string',
        default: '',
        description: 'Additional args other than open the terminal',
    },
    MacWinRunDirectly: {
        type: 'boolean',
        default: false,
        description: 'For mac, we prepend `open -a` unless we run it directly; for windows, we prepend `start` unless we run it directly.',
    },
}

export default config
