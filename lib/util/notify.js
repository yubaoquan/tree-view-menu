'use babel'
/* globals atom */

export default {
    error(title, detail) {
        atom.notifications.addError(title, { detail })
    },
    success(title) {
        atom.notifications.addSuccess(title)
    },
}
