// @flow
import { Editor, NodeEntry, Node, Transforms } from 'slate';

import { getItemDepth, isItem, isList, isListOrItem } from '../utils';
import type { Options } from '..';

/**
 * A rule that unwraps lists if they are over the depth limit
 */
export function unwrapListsOverDepthLimit(
  options: Options,
  editor: Editor,
): void {
  const { normalizeNode } = editor;

  editor.normalizeNode = (nodeEntry: NodeEntry) => {
    const [node, nodePath] = nodeEntry;

    if (isList(options)(node) && Node.has(editor, nodePath)) {
      const items = [...Node.children(editor, nodePath)];

      if (items.length === 0) {
        normalizeNode(nodeEntry);

        return;
      }

      const allChildrenAreItems = items.every(([itemNode]) =>
        isItem(options)(itemNode),
      );
      if (!allChildrenAreItems) {
        normalizeNode(nodeEntry);

        return;
      }

      const [[, firstItemPath]] = items;

      const itemDepth = getItemDepth(options)(editor, firstItemPath);
      if (itemDepth > options.maxDepth) {
        Transforms.unwrapNodes(editor, {
          at: nodePath,
          mode: 'lowest',
          match: isListOrItem(options),
        });
        Transforms.unwrapNodes(editor, {
          at: nodePath,
        });

        return;
      }
    }

    normalizeNode(nodeEntry);
  };
}
