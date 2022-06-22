// @flow
import { Editor, NodeEntry, Node, Transforms, Path } from 'slate';

import { isItem, isList } from '../utils';
import type { Options } from '..';

/**
 * A rule that unwraps list items if they are not in list
 */
export function itemsWithoutParentListAreUnwrapped(
  options: Options,
  editor: Editor
): void {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry): void => {
    const [node, nodePath] = entry;
    let parentNodePath;

    if (!isItem(options)(node)) {
      normalizeNode(entry);

      return;
    }

    try {
      parentNodePath = Path.parent(nodePath);
    } catch (e) {
      // has no parent (ie. [0] node)
      normalizeNode(entry);

      return;
    }

    const parentNode = parentNodePath && Node.get(editor, parentNodePath);

    // either no parent or not a list parent
    // in both cases, we unwrap list item
    if (!parentNode || !isList(options)(parentNode)) {
      Transforms.unwrapNodes(editor, {
        at: nodePath,
      });

      return;
    }

    normalizeNode(entry);
  };
}
