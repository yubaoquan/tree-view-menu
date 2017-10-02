'use babel'
/* global atom waitsForPromise */
/* eslint-env node, jasmine */

describe('trigger button', () => {
    let workspaceElement

    beforeEach(() => {
        atom.open({ pathsToOpen: ['/Users/baoquanyu/github/tree-view-menu'] })
        waitsForPromise(() => {
            return atom.packages.activatePackage('tree-view')
        })
        waitsForPromise(() => {
            return atom.packages.activatePackage('tree-view-menu')
        })
        waitsForPromise(() => {
            const treeViewInstance = atom.packages.getActivePackage('tree-view').mainModule.getTreeViewInstance()
            return treeViewInstance.toggleFocus()
        })
    })
    it('should activate the tree-view', () => {
        expect(atom.packages.isPackageActive('tree-view')).toBe(true)
    })
    it('will showup when mouseover an entry', () => {
        workspaceElement = atom.views.getView(atom.workspace)
        const treeViewDom = workspaceElement.querySelector('.tree-view')
        expect(treeViewDom).toExist()
        expect(workspaceElement.querySelector('.tree-view-menu-btn')).not.toExist()

        // entry is null, not understand why
        const entry = workspaceElement.querySelector('.tree-view .entry .list-item')
        expect(entry).toExist()
        entry.dispatchEvent(new CustomEvent('mouseover'))
        expect(workspaceElement.querySelector('.tree-view-menu-btn')).toExist()
    })
})
