// @flow
import { Editor, NodeEntry, Node, Transforms, Path } from 'slate';

import { isItem, isList } from '../utils';
import { type Options } from '..';

/**
 * A rule that wraps children of lists with list item
 */
export function childOfListIsAlwaysItem(
  options: Options,
  editor: Editor,
): void {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry): void => {
    const [node, nodePath] = entry;
    let parentNodePath;

    if (isItem(options)(node)) {
      // we don't care for those that are items already
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

    const parentNode = Node.get(editor, parentNodePath);

    if (isList(options)(parentNode)) {
      const wrapperItem = {
        type: options.typeItem,
        children: [],
      };

      Transforms.wrapNodes(editor, wrapperItem, {
        at: nodePath,
      });

      return;
    }

    normalizeNode(entry);
  };
}
