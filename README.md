# slate-edit-list

[![npm version](https://badge.fury.io/js/%40dock-hq%2Fslate-edit-list.svg)](https://badge.fury.io/js/%40dock-hq%2Fslate-edit-list)

A Slate plugin to handle keyboard events in lists. List items can contain blocks.

Compatible with `slate` version `^0.50`.

Demo: [gitbookio.github.io/slate-edit-list/](https://gitbookio.github.io/slate-edit-list/)

### Install

```
npm install @dock-hq/slate-edit-list
```

### Features

Natural keybindings:

- Pressing <kbd>Enter</kbd> insert a new list item
- Pressing <kbd>Shift+Enter</kbd> split the block in the list item
- Pressing <kbd>Tab</kbd> increase the depth of the item (creates a sub-list)
- Pressing <kbd>Shift+Tab</kbd> decrease the depth of the item
- Pressing <kbd>Delete</kbd> (OSX) or <kbd>Backspace</kbd> at the start, remove the list item (or the list)

Simple validation/normalization (see [assumptions about the schema](#assumption-about-the-schema)):

- Lists can contain only list items, and at least one.
- List items can only be the direct children of a list.
- List items must always contain blocks.

Useful transforms: see [Utilities and Transforms](#utilities-and-transforms).

### Simple Usage

```js
import { EditListPlugin } from '@dock-hq/slate-edit-list';

const options = {}; // additional options

const [
  withEditList, // applies normalization to editor
  onKeyDown, // keyDown handler for keyboard shortcuts
  { Editor, Element, Transforms }, // Slate classes with added utility functions and transforms this package provides
] = EditListPlugin(options);

const editor = useMemo(() => withEditList(withReact(createEditor())), []);

const [value, setValue] = useState([]);

return (
  <Slate
    editor={editor}
    value={value}
    onChange={newValue => setValue(newValue)}
  >
    <Editable onKeyDown={onKeyDown(editor)} />
  </Slate>
);
```

#### Arguments

This plugin accepts options to redefine the following block types:

- `types: string = ["ul_list", "ol_list"]` — the array of possible types for list containers. First value will be used as default.
- `typeItem: string = "list_item"` — type for list items.
- `typeDefault: string = "paragraph"` — type for default block in list items.
- `canMerge: (Node, Node) => boolean` — controls which list can be merged automatically (for example when they are adjacent). Defaults to merging list with identical types

#### Assumption about the schema

You can use this plugin with custom list block types (using plugin [arguments](#arguments)). But your list structure should still conform to a few rules. These rules are implemented as normalizations.

Here is what a minimal list would look like:

```yaml
nodes:
  - kind: block
    type: ul_list # Default type for bulleted lists container
    nodes:
      - kind: block
        type: list_item # List containers can only contain list items
        nodes:
          # List items contain blocks. They cannot be the direct container of text.
          - kind: block
            type: paragraph # Default type of blocks in a list item
            nodes:
              - kind: text
                text: Hello World
```

And here is an example of a multi-level list:

```yaml
nodes:
  - kind: block
    type: ol_list
    nodes:
      - kind: block
        type: list_item
        nodes:
          - kind: block
            type: paragraph
            nodes:
              - kind: text
                text: Item 1
          - kind: block
            type: ol_list
            nodes:
              - kind: block
                type: list_item
                nodes:
                  - kind: block
                    type: paragraph
                    nodes:
                      - kind: text
                        text: Item 1.1
              - kind: block
                type: list_item
                nodes:
                  - kind: block
                    type: paragraph
                    nodes:
                      - kind: text
                        text: Item 1.2
```

### Utilities and Transforms

`slate-edit-list` exports utilities and transforms:

#### Element

##### `Element.isList(node: Node) => boolean`

Return true if the type of the node is one of the list types from options.

##### `Element.isItem(node: Node) => boolean`

Return true if the type of the node is the list item type from options.

#### Editor

##### `Editor.isSelectionInList(editor: Editor) => boolean`

Return true if selection is inside a list (and it can be unwrapped).

##### `Editor.getItemDepth(editor: Editor, path?: Path) => number`

Returns the depth of the current item (or the depth of the given path) in a list. 0 means not in a list.

##### `Editor.getDeepestItemDepth(editor: Editor, path: Path) => number`

Returns the depth of the deepest list item in a path.

##### `Editor.getCurrentItem(editor: Editor, path?: Path) => NodeEntry<Element> || null`

Returns the current item at selection (or at the given path).

##### `Editor.getCurrentList(editor: Editor, path?: Path) => NodeEntry<Element> || null`

Returns the current list at selection (or at the given path).

##### `Editor.getPreviousItem(editor: Editor, path?: Path) => NodeEntry<Element> || null`

Returns the list item preceding the item at selection (or at the given path).

##### `Editor.getListForItem(editor: Editor, path: Path) => NodeEntry<Element> || null`

Returns the list element the item at the specified path belongs to.

##### `Editor.getItemsAtRange(editor: Editor, range?: Range) => Array<NodeEntry<Element>>`

Return an array of items at the given range. The returned items are the highest list of successive items that cover the given range.

The returned array is empty if no such list can be found.

#### Transforms

##### `Transforms.increaseItemDepth(editor: Editor) => void`

Increase the depth of the current item.

##### `Transforms.decreaseItemDepth(editor: Editor) => void`

Decrease the depth of the current item.

##### `Transforms.wrapInList(editor: Editor, type?: string, data?: {}) => void`

Wrap the current blocks in list items of a list container of the given type. You can pass optional data for the created list container.

##### `Transforms.unwrapList(editor: Editor) => void`

Unwrap all items at range from their list.

##### `Transforms.splitListItem(editor: Editor) => void`

Split current block into a new list item.

##### `Transforms.toggleList(editor: Editor) => void`

Toggle (wrap/unwrap) list at selection.
