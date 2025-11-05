// @flow
import {
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  PathRef,
  Transforms,
  Text,
} from 'slate';
import { type Options } from '..';
import { isList, isItem } from '../utils';

type NodeRefEntry<T> = [T, PathRef];

/**
 * Returns the highest list of elements that cover the current selection
 * TODO: might be redundant with getTopmostItemsAtRange.js
 */
const getHighestSelectedElements = (options: Options) => (
  editor: Editor
): Array<NodeEntry<Element>> => {
  const selection = editor.selection;

  if (!selection) {
    return [];
  }

  if (Path.equals(selection.anchor.path, selection.focus.path)) {
    const ancestor = Editor.above(editor, {
      match: n =>
        !Editor.isEditor(n) && Editor.isBlock(editor, n) && !Text.isText(n),
    });

    return [ancestor];
  }

  // For sibling cases, use the original efficient approach
  const ancestorPath = Path.common(selection.anchor.path, selection.focus.path);
  const startIndex = Path.relative(selection.anchor.path, ancestorPath)[0];
  const endIndex = Path.relative(selection.focus.path, ancestorPath)[0];

  const siblings = [...Node.children(editor, ancestorPath)].slice(
    startIndex,
    endIndex + 1
  );

  // Check if these are true siblings (have same parent) or if there are container blocks
  const allHaveSameParent = siblings.every(([, path]) => {
    return Path.equals(Path.parent(path), ancestorPath);
  });

  // Check if any of the siblings are container blocks (like columns) that contain other selected blocks
  // A container block is one where there are multiple BLOCK levels between the sibling and the selection
  // (e.g., columns > column > paragraph, not just list > list_item > paragraph)
  const hasContainerBlocks = siblings.some(([siblingNode, siblingPath]) => {
    // Skip lists - they're not containers, they're just lists
    if (isList(options)(siblingNode)) {
      return false;
    }

    // Check if selection anchor or focus is a descendant of this sibling
    const anchorPath = selection.anchor.path;
    const focusPath = selection.focus.path;
    const isAnchorDescendant = Path.isDescendant(anchorPath, siblingPath);
    const isFocusDescendant = Path.isDescendant(focusPath, siblingPath);

    if (!isAnchorDescendant && !isFocusDescendant) {
      return false;
    }

    // Count how many BLOCK nodes are between the sibling and the selection
    // We do this by walking up from the selection to the sibling and counting blocks
    const countBlockLevels = descendantPath => {
      if (!Path.isDescendant(descendantPath, siblingPath)) return 0;

      let currentPath = descendantPath;
      let blockCount = 0;

      // Walk up to the sibling, counting block nodes (not text nodes)
      while (currentPath.length > siblingPath.length) {
        const parentPath = Path.parent(currentPath);
        if (parentPath.length === siblingPath.length) break;

        const node = Node.get(editor, parentPath);
        // Count if it's a block (not text, not editor)
        if (node && Editor.isBlock(editor, node) && !Text.isText(node)) {
          blockCount++;
        }
        currentPath = parentPath;
      }

      return blockCount;
    };

    // If there are 1+ block levels between sibling and selection, it's a container
    // (e.g., column > paragraph = 1 block, so column is a container)
    // We want to get paragraphs, not columns
    const anchorBlockLevels = countBlockLevels(anchorPath);
    const focusBlockLevels = countBlockLevels(focusPath);
    return anchorBlockLevels >= 1 || focusBlockLevels >= 1;
  });

  if (allHaveSameParent && !hasContainerBlocks) {
    // Original behavior for true siblings that aren't containers - return them directly
    return siblings;
  }

  // For non-sibling cases (e.g., across columns), use the new approach
  // Find all block elements that intersect with the selection
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

const convertPathsToRefs = (
  editor,
  nodeEntries: Array<NodeEntry<Node>>
): Array<NodeRefEntry<Node>> =>
  nodeEntries.map(([node, path]) => [node, Editor.pathRef(editor, path)]);

const cleanupRefs = (
  nodeRefEntries: Array<NodeRefEntry<Node>>
): Array<NodeEntry<Node>> =>
  nodeRefEntries.map(([node, pathRef]) => [node, pathRef.unref()]);

/**
 * Wrap the blocks in the current selection in a new list. Selected
 * lists are merged together.
 */
export const wrapInList = (options: Options) => (
  editor: Editor,
  type?: string,
  data?: Object
): void => {
  type = type || options.types[0];

  Editor.withoutNormalizing(editor, () => {
    const selectedElements = convertPathsToRefs(
      editor,
      getHighestSelectedElements(options)(editor)
    );

    if (selectedElements.length === 0) {
      return;
    }

    // Check if all selected elements are siblings (same parent)
    const areAllSiblings =
      selectedElements.length <= 1 ||
      selectedElements.every(([, pathRef]) => {
        const parentPath = Path.parent(pathRef.current);
        const firstParentPath = Path.parent(selectedElements[0][1].current);
        return Path.equals(parentPath, firstParentPath);
      });

    // Check if there's a block type in blockTypesToKeepSeparate between selected elements
    let hasSeparatorBlock = false;

    if (
      options.blockTypesToKeepSeparate &&
      options.blockTypesToKeepSeparate.length > 0 &&
      selectedElements.length > 1
    ) {
      // Check if any ancestor block between selected elements matches blockTypesToKeepSeparate
      const firstPath = selectedElements[0][1].current;
      const lastPath = selectedElements[selectedElements.length - 1][1].current;
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
          hasSeparatorBlock = true;
          break;
        }
        if (Path.equals(currentPath, commonAncestorPath)) break;
        currentPath = Path.parent(currentPath);
      }

      // Also check paths from last element up to and including common ancestor
      if (!hasSeparatorBlock) {
        currentPath = lastPath;
        while (currentPath.length >= commonAncestorPath.length) {
          const node = Node.get(editor, currentPath);
          if (
            node &&
            node.type &&
            options.blockTypesToKeepSeparate.includes(node.type)
          ) {
            hasSeparatorBlock = true;
            break;
          }
          if (Path.equals(currentPath, commonAncestorPath)) break;
          currentPath = Path.parent(currentPath);
        }
      }

      // Check common ancestor itself and its ancestors up to editor
      if (!hasSeparatorBlock) {
        currentPath = commonAncestorPath;
        while (currentPath.length >= 0) {
          const node = Node.get(editor, currentPath);
          if (
            node &&
            node.type &&
            options.blockTypesToKeepSeparate.includes(node.type)
          ) {
            hasSeparatorBlock = true;
            break;
          }
          if (currentPath.length === 0) break;
          currentPath = Path.parent(currentPath);
        }
      }
    }

    // If there's a separator block type, always keep lists separate
    const shouldMerge = areAllSiblings && !hasSeparatorBlock;

    if (shouldMerge) {
      // Original behavior: wrap all sibling blocks together
      const newList = {
        type,
        ...(data && { data }),
      };

      // Wrap all selected blocks in the list first (including list items)
      Transforms.wrapNodes(editor, newList, {
        match: n =>
          !Editor.isEditor(n) && Editor.isBlock(editor, n) && !Text.isText(n),
      });

      // Then handle each selected element
      selectedElements.forEach(([node, pathRef]) => {
        // pathRef.current should update automatically after wrapping
        const currentPath = pathRef.current;
        if (!currentPath) {
          pathRef.unref();
          return;
        }

        const currentNode = Node.get(editor, currentPath);

        if (isList(options)(currentNode)) {
          // Unwrap the inner list to merge its items with the outer list
          Transforms.unwrapNodes(editor, {
            at: currentPath,
          });
        } else if (!isItem(options)(currentNode)) {
          // Wrap non-list-item blocks in list items
          Transforms.wrapNodes(
            editor,
            { type: options.typeItem },
            {
              at: currentPath,
            }
          );
        }
        pathRef.unref();
      });
    } else {
      // Blocks are in different branches (e.g., different columns)
      // Or there's a block type that should keep lists separate
      const shouldMergeLists = !hasSeparatorBlock;
      const newList = {
        type,
        ...(data && { data }),
      };
      const listPathRefs = [];

      selectedElements.forEach(([node, pathRef]) => {
        if (isList(options)(node)) {
          // For lists in non-sibling positions, we need to handle them specially
          // For now, just wrap the list itself (will create nested list)
          // This is a simplified approach - in practice you might want separate lists
          Transforms.wrapNodes(editor, newList, {
            at: pathRef.current,
          });

          const wrappedListPath = Path.parent(pathRef.current);
          listPathRefs.push(Editor.pathRef(editor, wrappedListPath));

          // Then unwrap the inner list to merge items
          Transforms.unwrapNodes(editor, {
            at: pathRef.current,
          });

          pathRef.unref();
          return;
        }

        // Wrap the block in a list item first
        Transforms.wrapNodes(
          editor,
          { type: options.typeItem },
          {
            at: pathRef.current,
          }
        );

        // Get the list item path after wrapping (it's now the parent of the original path)
        const listItemPath = Path.parent(pathRef.current);
        const listItemPathRef = Editor.pathRef(editor, listItemPath);

        // Wrap the list item in a list
        Transforms.wrapNodes(editor, newList, {
          at: listItemPath,
        });

        // Get the list path after wrapping (it's now the parent of the list item)
        const listPath = Path.parent(listItemPathRef.current);
        listPathRefs.push(Editor.pathRef(editor, listPath));

        listItemPathRef.unref();
        pathRef.unref();
      });

      // Merge all lists into the first one (unless we should keep them separate)
      if (
        shouldMergeLists &&
        listPathRefs.length > 1 &&
        listPathRefs[0].current
      ) {
        const firstListPathRef = listPathRefs[0];
        const firstListPath = firstListPathRef.current;
        let firstList = Node.get(editor, firstListPath);

        if (isList(options)(firstList)) {
          // Move all items from other lists into the first list
          for (let i = listPathRefs.length - 1; i > 0; i--) {
            const listPathRef = listPathRefs[i];
            const listPath = listPathRef.current;

            if (!listPath || Path.equals(listPath, firstListPath)) {
              listPathRef.unref();
              continue;
            }

            const list = Node.has(editor, listPath)
              ? Node.get(editor, listPath)
              : null;

            if (list && isList(options)(list)) {
              // Refresh firstList in case it changed
              firstList = Node.get(editor, firstListPath);
              const firstListLastChildIndex = firstList.children.length;

              // Move all children from this list to the first list
              Transforms.insertNodes(editor, list.children, {
                at: [...firstListPath, firstListLastChildIndex],
              });

              Transforms.removeNodes(editor, {
                at: listPath,
              });
            }

            listPathRef.unref();
          }
        }

        firstListPathRef.unref();
      } else if (listPathRefs.length === 1) {
        listPathRefs[0].unref();
      }
    }

    cleanupRefs(selectedElements);
  });
};
