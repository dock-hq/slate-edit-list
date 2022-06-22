// @flow
import {
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  PathRef,
  Transforms,
} from 'slate';
import { type Options } from '..';
import { isList } from '../utils';

type NodeRefEntry<T> = [T, PathRef];

/**
 * Returns the highest list of elements that cover the current selection
 * TODO: might be redundant with getTopmostItemsAtRange.js
 */
const getHighestSelectedElements = (
  editor: Editor
): Array<NodeEntry<Element>> => {
  const selection = editor.selection;

  if (!selection) {
    return [];
  }

  if (Path.equals(selection.anchor.path, selection.focus.path)) {
    const ancestor = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n),
    });

    return [ancestor];
  }

  const ancestorPath = Path.common(selection.anchor.path, selection.focus.path);

  const startIndex = Path.relative(selection.anchor.path, ancestorPath)[0];
  const endIndex = Path.relative(selection.focus.path, ancestorPath)[0];

  return [...Node.children(editor, ancestorPath)].slice(
    startIndex,
    endIndex + 1
  );
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
      getHighestSelectedElements(editor)
    );
    const newList = {
      type,
      ...(data && { data }),
    };

    Transforms.wrapNodes(editor, newList, {
      match: (n) => Editor.isBlock(editor, n),
    });

    // Wrap in list items
    selectedElements.forEach(([node, pathRef]) => {
      if (isList(options)(node)) {
        // Merge its items with the created list
        Transforms.unwrapNodes(editor, {
          at: pathRef.current,
        });
      } else {
        Transforms.wrapNodes(
          editor,
          { type: options.typeItem },
          {
            at: pathRef.current,
          }
        );
      }

      pathRef.unref();
    });

    cleanupRefs(selectedElements);
  });
};
