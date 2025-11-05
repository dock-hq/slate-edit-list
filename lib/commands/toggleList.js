// @flow
import { Editor, Node, NodeEntry, Path, Range, Transforms, Text } from 'slate';
import type { Options } from '..';
import { decreaseItemDepth, unwrapList, wrapInList } from '.';
import {
  isItem,
  getTopmostItemsAtRange,
  getItemsAtRange,
  getItemDepth,
  isListOrItem,
  isList,
} from '../utils';

const allItemsOnSameLevel = (nodeEntries: Array<NodeEntry>): boolean => {
  if (nodeEntries.length === 0) {
    return true;
  }

  const referenceDepth = nodeEntries[0][1].length;

  return !nodeEntries.some(
    ([, nodeEntryPath]) => nodeEntryPath.length !== referenceDepth,
  );
};

const isListItemAfterTheFirstItem = (
  listItemPath: Path,
  closestListItem?: NodeEntry,
) => {
  if (closestListItem) {
    return !Path.isAncestor(listItemPath, closestListItem[1]);
  }

  return true;
};

const unwrapAllItemsInSelection = (options: Options) => (
  editor: Editor,
  listItemsInSelection: Array<NodeEntry>,
) => {
  const listItemPathRefs = listItemsInSelection.map(([, listItemPath]) =>
    Editor.pathRef(editor, listItemPath),
  );

  // move items leftmost, start from the end so only one item is affected
  Editor.withoutNormalizing(editor, () => {
    listItemPathRefs.reverse().forEach(listItemPathRef => {
      while (getItemDepth(options)(editor, listItemPathRef.current) > 1) {
        decreaseItemDepth(options)(editor, listItemPathRef.current);
      }
    });
  });

  const listItemsRange = Editor.range(
    editor,
    listItemPathRefs[0].current,
    listItemPathRefs[listItemPathRefs.length - 1].current,
  );

  Transforms.select(editor, listItemsRange);
  unwrapList(options)(editor);

  listItemPathRefs.forEach(listItemPathRef => listItemPathRef.unref());
};

/**
 * Get the highest selected elements (blocks) that cover the selection.
 * Similar to getHighestSelectedElements in wrapInList but tailored for toggleList.
 */
const getHighestSelectedBlocks = (options: Options) => (
  editor: Editor
): Array<NodeEntry> => {
  const selection = editor.selection;

  if (!selection) {
    return [];
  }

  // For single cursor, get the block at cursor
  if (Path.equals(selection.anchor.path, selection.focus.path)) {
    const ancestor = Editor.above(editor, {
      match: n =>
        !Editor.isEditor(n) && Editor.isBlock(editor, n) && !Text.isText(n),
    });
    return ancestor ? [ancestor] : [];
  }

  // For range selections, find all block elements that intersect with the selection
  const allBlockNodes = [
    ...Editor.nodes(editor, {
      at: selection,
      match: n =>
        !Editor.isEditor(n) && Editor.isBlock(editor, n) && !Text.isText(n),
    }),
  ];

  // Filter to keep only relevant blocks:
  // - Lists are kept even if they contain other blocks (they'll be unwrapped)
  // - List items are excluded (we only want to process their parent lists or their content)
  // - Other blocks are kept only if they're leaf blocks (not containers like columns)
  const selectedBlocks = allBlockNodes.filter(([node, path]) => {
    // Exclude list items - we process their parent lists or their content instead
    if (isItem(options)(node)) {
      return false;
    }

    // Always keep lists if they're directly selected
    if (isList(options)(node)) {
      return true;
    }

    // For other blocks, check if this block contains any other selected block
    // If it does, it's a container and we should exclude it
    return !allBlockNodes.some(([, otherPath]) => {
      if (Path.equals(path, otherPath)) {
        return false; // Skip self
      }
      // Check if otherPath is a descendant of path
      return Path.isDescendant(otherPath, path);
    });
  });

  return selectedBlocks;
};

/**
 * Check if selection spans multiple columns (using blockTypesToKeepSeparate).
 */
const spansMultipleColumns = (options: Options) => (
  editor: Editor,
  selectedBlocks: Array<NodeEntry>
): boolean => {
  if (
    !options.blockTypesToKeepSeparate ||
    options.blockTypesToKeepSeparate.length === 0 ||
    selectedBlocks.length <= 1
  ) {
    return false;
  }

  // Check if there's a block type in blockTypesToKeepSeparate between selected blocks
  const firstPath = selectedBlocks[0][1];
  const lastPath = selectedBlocks[selectedBlocks.length - 1][1];
  const commonAncestorPath = Path.common(firstPath, lastPath);

  // Check paths from first element up to and including common ancestor
  let currentPath = firstPath;
  while (currentPath.length >= commonAncestorPath.length) {
    const node = Node.get(editor, currentPath);
    if (
      node &&
      node.type &&
      options.blockTypesToKeepSeparate.includes(node.type)
    ) {
      return true;
    }
    if (Path.equals(currentPath, commonAncestorPath)) break;
    currentPath = Path.parent(currentPath);
  }

  // Also check paths from last element up to and including common ancestor
  currentPath = lastPath;
  while (currentPath.length >= commonAncestorPath.length) {
    const node = Node.get(editor, currentPath);
    if (
      node &&
      node.type &&
      options.blockTypesToKeepSeparate.includes(node.type)
    ) {
      return true;
    }
    if (Path.equals(currentPath, commonAncestorPath)) break;
    currentPath = Path.parent(currentPath);
  }

  // Check common ancestor itself and its ancestors up to editor
  currentPath = commonAncestorPath;
  while (currentPath.length >= 0) {
    const node = Node.get(editor, currentPath);
    if (
      node &&
      node.type &&
      options.blockTypesToKeepSeparate.includes(node.type)
    ) {
      return true;
    }
    if (currentPath.length === 0) break;
    currentPath = Path.parent(currentPath);
  }

  return false;
};

/**
 * Check if a block is inside a list.
 */
const isBlockInList = (options: Options) => (
  editor: Editor,
  blockPath: Path
): boolean => {
  const list = Editor.above(editor, {
    at: blockPath,
    match: node => isList(options)(node),
  });
  return list !== undefined;
};

/**
 * Toggle list on the selected range.
 */
export const toggleList = (options: Options) => (
  editor: Editor,
  ...newListOptions
): void => {
  const range = editor.selection;

  if (!range) {
    return;
  }

  const [startElement, startElementPath] = Editor.parent(
    editor,
    Range.start(range),
  );

  const [endElement, endElementPath] = Editor.parent(editor, Range.end(range));

  const singleElementInSelection = startElement === endElement;

  // Get highest selected blocks to check for multi-column selection
  const selectedBlocks = getHighestSelectedBlocks(options)(editor);

  // Check if selection spans multiple columns
  const isMultiColumn = spansMultipleColumns(options)(editor, selectedBlocks);

  if (isMultiColumn && selectedBlocks.length > 0) {
    // Handle multi-column selection
    Editor.withoutNormalizing(editor, () => {
      // Check which blocks are in lists (either they are lists themselves or inside list items)
      const blocksInLists = selectedBlocks.filter(([block, blockPath]) => {
        // Block is itself a list
        if (isList(options)(block)) {
          return true;
        }
        // Block is inside a list (has a list ancestor)
        return isBlockInList(options)(editor, blockPath);
      });
      const blocksNotInLists = selectedBlocks.filter(
        ([block, blockPath]) => {
          // Block is itself a list
          if (isList(options)(block)) {
            return false;
          }
          // Block is not inside a list
          return !isBlockInList(options)(editor, blockPath);
        }
      );

      const allHaveLists = blocksNotInLists.length === 0;
      const noneHaveLists = blocksInLists.length === 0;
      const mixed = !allHaveLists && !noneHaveLists;

      if (allHaveLists) {
        // All columns have lists: unwrap them all
        // For multi-column scenarios, manually unwrap each list to ensure correct behavior
        const listPathRefs = blocksInLists
          .filter(([block]) => isList(options)(block))
          .map(([, blockPath]) => Editor.pathRef(editor, blockPath));

        listPathRefs.forEach(listPathRef => {
          const listPath = listPathRef.current;
          if (!listPath) {
            listPathRef.unref();
            return;
          }

          // Get all items in this list
          const listItems = [
            ...Editor.nodes(editor, {
              at: listPath,
              match: isItem(options),
            }),
          ];

          // Unwrap each item
          const itemPathRefs = listItems.map(([, itemPath]) =>
            Editor.pathRef(editor, itemPath)
          );

          itemPathRefs.forEach(itemPathRef => {
            const itemPath = itemPathRef.current;
            if (!itemPath) {
              itemPathRef.unref();
              return;
            }

            // Lift the list item out of the list first (moves it to column level)
            Transforms.liftNodes(editor, {
              at: itemPath,
            });

            // Get the updated path after lifting
            const liftedPath = itemPathRef.current;
            if (liftedPath) {
              // Now unwrap the list item, which should preserve its children (paragraphs)
              Transforms.unwrapNodes(editor, {
                at: liftedPath,
              });
            }
            itemPathRef.unref();
          });

          // Remove the now-empty list if it still exists
          if (Node.has(editor, listPath)) {
            const list = Node.get(editor, listPath);
            if (isList(options)(list) && list.children.length === 0) {
              Transforms.removeNodes(editor, {
                at: listPath,
              });
            }
          }

          listPathRef.unref();
        });
      } else {
        // None have lists OR mixed: wrap all blocks (add lists to all)
        if (mixed) {
          // For mixed case, only wrap blocks that don't have lists
          // Blocks that already have lists should be left as is
          const type = newListOptions[0] || options.types[0];
          const data = newListOptions[1];

          // Use path refs to handle path changes during wrapping
          const blockPathRefs = blocksNotInLists.map(([, blockPath]) =>
            Editor.pathRef(editor, blockPath)
          );

          blockPathRefs.forEach(blockPathRef => {
            const blockPath = blockPathRef.current;
            if (!blockPath) {
              blockPathRef.unref();
              return;
            }

            // Wrap the block in a list item first
            Transforms.wrapNodes(
              editor,
              { type: options.typeItem },
              {
                at: blockPath,
              }
            );

            // Get the updated block path (it's now a child of the list item)
            // The list item is at the parent of the updated block path
            const updatedBlockPath = blockPathRef.current;
            if (!updatedBlockPath) {
              blockPathRef.unref();
              return;
            }
            const listItemPath = Path.parent(updatedBlockPath);
            const listItemPathRef = Editor.pathRef(editor, listItemPath);

            // Wrap the list item in a list
            Transforms.wrapNodes(
              editor,
              {
                type,
                ...(data && { data }),
              },
              {
                at: listItemPath,
              }
            );

            listItemPathRef.unref();
            blockPathRef.unref();
          });
        } else {
          // None have lists: use wrapInList directly
          wrapInList(options)(editor, ...newListOptions);
        }
      }
    });
    return;
  }

  // Original single-column logic
  if (singleElementInSelection) {
    if (getTopmostItemsAtRange(options)(editor).length > 0) {
      unwrapList(options)(editor);
    } else {
      wrapInList(options)(editor, ...newListOptions);
    }
    return;
  }

  const firstImmediateListItemInSelection = Editor.above(editor, {
    at: Range.start(range),
    match: isItem(options),
  });
  // filter is necessary since getting all items at range
  // includes the leftmost item in deeply nested lists
  // which doesn't actually feel or seem (UX) like it's part of the selection
  const listItemsInSelection = getItemsAtRange(options)(
    editor,
  ).filter(([, listItemPath]) =>
    isListItemAfterTheFirstItem(
      listItemPath,
      firstImmediateListItemInSelection,
    ),
  );

  const noItemsInSelection = listItemsInSelection.length === 0;
  if (noItemsInSelection) {
    wrapInList(options)(editor, ...newListOptions);
    return;
  }

  if (allItemsOnSameLevel(listItemsInSelection)) {
    unwrapList(options)(editor);
    return;
  }

  const ancestorPath = Path.common(startElementPath, endElementPath);
  const ancestor = Node.get(editor, ancestorPath);
  if (!isListOrItem(options)(ancestor)) {
    unwrapList(options)(editor);
  }

  unwrapAllItemsInSelection(options)(editor, listItemsInSelection);
};
