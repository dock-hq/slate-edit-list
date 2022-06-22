// @flow
import { Editor, Element, Node, NodeEntry, Path } from 'slate';

import { type Options } from '..';
import { isItem } from '.';

/**
 * Return the current list item, from current selection or from a node.
 */
export const getCurrentItem = (options: Options) => (
  editor: Editor,
  path?: Path
): ?NodeEntry<Element> => {
  if (!path) {
    if (!editor.selection) return null;
    [, path] = Editor.first(editor, editor.selection);
  }

  const nodeOnPath = Node.get(editor, path);
  if (nodeOnPath && isItem(options)(nodeOnPath)) {
    return [nodeOnPath, path];
  }

  return (
    Editor.above(editor, {
      at: path,
      match: (node: Node) => isItem(options)(node),
      mode: 'lowest',
    }) || null
  );
};
