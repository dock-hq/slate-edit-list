// @flow
import { Editor, Node, NodeEntry, Path, Range, Transforms } from 'slate';
import type { Options } from '..';
import { decreaseItemDepth, unwrapList, wrapInList } from '.';
import {
  isItem,
  getTopmostItemsAtRange,
  getItemsAtRange,
  getItemDepth,
  isListOrItem,
} from '../utils';

const allItemsOnSameLevel = (nodeEntries: Array<NodeEntry>): boolean => {
  if (nodeEntries.length === 0) {
    return true;
  }

  const referenceDepth = nodeEntries[0][1].length;

  return !nodeEntries.some(
    ([, nodeEntryPath]) => nodeEntryPath.length !== referenceDepth
  );
};

const isListItemAfterTheFirstItem = (
  listItemPath: Path,
  closestListItem?: NodeEntry
) => {
  if (closestListItem) {
    return !Path.isAncestor(listItemPath, closestListItem[1]);
  }

  return true;
};

const unwrapAllItemsInSelection = (options: Options) => (
  editor: Editor,
  listItemsInSelection: Array<NodeEntry>
) => {
  const listItemPathRefs = listItemsInSelection.map(([, listItemPath]) =>
    Editor.pathRef(editor, listItemPath)
  );

  // move items leftmost, start from the end so only one item is affected
  Editor.withoutNormalizing(editor, () => {
    listItemPathRefs.reverse().forEach((listItemPathRef) => {
      while (getItemDepth(options)(editor, listItemPathRef.current) > 1) {
        decreaseItemDepth(options)(editor, listItemPathRef.current);
      }
    });
  });

  const listItemsRange = Editor.range(
    editor,
    listItemPathRefs[0].current,
    listItemPathRefs[listItemPathRefs.length - 1].current
  );

  Transforms.select(editor, listItemsRange);
  unwrapList(options)(editor);

  listItemPathRefs.forEach((listItemPathRef) => listItemPathRef.unref());
};

/**
 * Toggle list on the selected range.
 */
export const toggleList = (options: Options) => (
  editor: Editor,
  ...newListOptions
): void => {
  const range = editor.selection;
  const [startElement, startElementPath] = Editor.parent(
    editor,
    Range.start(range)
  );
  const [endElement, endElementPath] = Editor.parent(editor, Range.end(range));

  const singleElementInSelection = startElement === endElement;
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
    editor
  ).filter(([, listItemPath]) =>
    isListItemAfterTheFirstItem(listItemPath, firstImmediateListItemInSelection)
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
