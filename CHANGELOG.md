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
