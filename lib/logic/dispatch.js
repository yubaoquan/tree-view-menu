'use babel'

/* global atom */
import notify from '../util/notify'

export default {
    dispatch(cmd, node) {
        const registeredCommands = atom.commands.registeredCommands
        if (!registeredCommands[cmd]) {
            return notify.error(`Command '${cmd}' not registered`)
        }
        atom.commands.dispatch(node, cmd)
    },
}
