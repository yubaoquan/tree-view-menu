- 0.1.0 Init
- 0.1.1 Update readme
- 0.1.2 Upload more small gif
- 0.1.3 Fix search in directory method name wrong spell
- 0.1.4 Fix search in directory cannot call on the root folder
- 0.1.5 Fix query root node using class `icon-repo` cause NPE
- 0.1.6 Skip this version number to fix the problem of version number not correct
- 0.2.0 Add `ignore` feature
- 0.3.0 Add `collapse` and `dispatch` feature
- 0.4.0
    1. Add `button alias` feature
    2. Custom width and height of menu
- 0.4.1
    - bugfix:
        1. basename mixed a slash in rename feature
    - operation optimize:
        1. fix the order of operation buttons in menu panel
- 0.5.0 Custom width of menu buttons so the entire menu looks more tidy
- 0.5.1 Adjust button width when add button in setting panel
- 0.5.2 If current folder is collapsed, then click on `Collapse` will collapse the parent folder. This is useful in collapsing in big folder such as `node_modules`
- 0.6.0
    1. After create new file, open it instantly
    2. Proxy `find-and-replace` and `search-in-project`, user input text in the text edit modal and let this package to invoke the search
- 0.6.1 Fix regression: collapse others will collapse all folders to root
- 0.7.0 Add setting option: `Keep Search Text After Search`
- 0.8.0 Add setting option: `Button Position`, user can set the button to show on the left side of file or folder.
- 0.8.1
    1. Fix button on the left cover the arrow of folder.
    2. Fix remove class on a node which doesn't has a classList
- 0.8.2 Fix previous text remain in editor when creating new file / folder.
- 0.8.3 Fix a bug: sometimes the root path is undefined
- 0.9.0 Add `Terminal` feature: open the a terminal in target folder, if target is a file, open the terminal in the folder of the file.
- 0.9.1 Fix ignore logic find constant values in wrong place.
- 0.9.2 Update editor width.
- 0.9.3 Change style of trigger button to solve the position shaking of entries which contains trigger button.
- 0.9.4 Use a better way to solve the problem in 0.9.3.
- 1.0.0 Add config option `TerminalOpenPath`: with two values:
    1. `Open the terminal at current path`
    2. `Open the terminal at project root`

- 1.0.1 Replace file system monitor of tree-view with atom.project
- 1.0.2 Watch `onDidOpen` so tree-view expanded after opening file with command palette can trigger a recheck
- 1.0.3 Do not show trigger button on element which actually is not a directory or file entry. For example, a git branch entry

- 1.1.0
    1. Add ability to copy/paste files across atom windows
    3. Add tips after click the 'copy' button
    2. Fix typo of `copyProjectPath`


- 1.1.1
    1. Fix tree-view root path lost in dom elements when tree-view update.
    2. Rename dataset.root to dataset.treeViewMenuRoot to avoid mistaken this attribute as standard tree-view attribute.

- 1.1.2
    1. All panels should hide when lose focus.

- 1.2.0
    1. Add new feature `Reveal Active File`: When click on this button, the treeView will scroll to the active file.

- 1.2.1
    1. Update readme.
