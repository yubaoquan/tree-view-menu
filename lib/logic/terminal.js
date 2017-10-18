'use babel'
/* global atom */
import { exec } from 'child_process'
import { platform } from 'os'
import { name as packageName } from '../../package.json'

const platformType = platform()
export default function openTerminal(dirpath) {
    let cmdline
    const app = atom.config.get(`${packageName}.terminalApp`)
    const args = atom.config.get(`${packageName}.terminalArgs`)
    const runDirectly = atom.config.get(`${packageName}.MacWinRunDirectly`)

    cmdline = `"${app}" ${args} "${dirpath}"`
    if (platformType === 'darwin' && !runDirectly) {
        cmdline = `open -a ` + cmdline
    }
    if (platformType === 'win32' && !runDirectly) {
        cmdline = `start "" ` + cmdline
    }
    if (dirpath != null) {
        return exec(cmdline, {
            cwd: dirpath,
        })
    }
}
