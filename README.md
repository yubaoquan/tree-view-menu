# tree-view-menu

## Introduction

Show a button when mouse enters a file or folder entry in tree-view.

Click on this button can do one of things below:

1. Call a menu which contains frequently used buttons you selected in the setting panel.
2. Do an operation which is set by you in the setting panel.

## Advanced
This package provide some other operations which is not in the context menu of tree-view, such as `Collapse`, `Dispatch`, `Ignore`, `Terminal`

The `Terminal` feature is copied from [atom-terminal](https://atom.io/packages/atom-terminal), thanks to the author @[karan](https://atom.io/users/karan) orz


An interesting feature is `Dispatch`, it provides a way to set the button's behavior in registered atom commands.


## p.s.

1. This package is developed for use case of opening single project in atom,
so there may be some problems when open multiple projects or no project files in atom. If you happen to get any problem, please create an issue in the [this package's repo](https://github.com/yubaoquan/tree-view-menu).

2. When developing this package, the node in atom was in version 7.4.0, and the syntax `async/await` ran well. I think some atom in lower version would have trouble with new ES syntax(not investigated). So make sure your atom version is up to date.

## demo

Because the original demo2 and demo3 images and their clearly compressed ones are so big (over 8M each) that it may not be seen directly in this page. So I have to also put blurry ones to this page. I add the links of clearly versions as well. You can see the clearly version gif in [this package's repo](https://github.com/yubaoquan/tree-view-menu).


### demo1
![demo1](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/intro1-min.gif)

### demo2 clearly
![demo2-clearly](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/intro2-min.gif)

### demo2 blurry

![demo2-min](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/demo2-640-min.gif)

### [demo2 clearly compressed image link](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/intro2-min.gif)

### demo3 clearly

![demo3-clearly](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/intro3-min.gif)

### demo3 blurry

![demo3-min](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/demo3-640-min.gif)

### [demo3 clearly compressed image link](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/intro3-min.gif)

## Supported operation

- Close Pane
- Collapse Other Folders
- Collapse
- Collapse Root Folder
- Copy
- Copy Full Path
- Copy Name
- Copy Project Path
- Cut
- Delete
- Dispatch
- Duplicate
- Find And Replace
- Ignore
- New File
- New Folder
- Paste
- Rename
- Search In Directory
- Terminal

## Change log

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
- 0.5.0 Allow user custom the width of menu buttons so the entire menu looks more tidy
![demo](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/Screen%20Shot%202017-10-03%20at%2010.32.11%20AM.png)
- 0.5.1 Adjust button width when add button in setting panel
- 0.5.2 If current folder is collapsed, then click on `Collapse` will collapse the parent folder. This is useful in collapsing in big folder such as `node_modules`
- 0.6.0
    1. After create new file, open it instantly
    2. Proxy `find-and-replace` and `search-in-project`, user input text in the text edit modal and let this package to invoke the search
- 0.6.1 Fix regression: collapse others will collapse all folders to root
- 0.7.0 Add setting option: `Keep Search Text After Search`
- 0.8.0 Add setting option: `Button Position`, user can set the button to show on the left side of file or folder.

![demo](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/left-btn-demo.gif)

- 0.8.1
    1. Fix button on the left cover the arrow of folder.
    2. Fix remove class on a node which doesn't has a classList
- 0.8.2 Fix previous text remain in editor when creating new file / folder.
- 0.8.3 Fix a bug: sometimes the root path is undefined
- 0.9.0 Add `Terminal` feature: open the a terminal in target folder, if target is a file, open the terminal in the folder of the file.
- 0.9.1 Fix ignore logic find constant values in wrong place.
- 0.9.2 Update editor width.

![terminal](https://raw.githubusercontent.com/yubaoquan/yubaoquan.github.io/master/images/tree-view-menu/terminal.gif)

## TODO

- Unit test needed
- Refactor to typescript
