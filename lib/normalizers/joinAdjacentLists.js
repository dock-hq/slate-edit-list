// @flow
import { Editor, NodeEntry, Node, Transforms, Path } from 'slate';

import { isList } from '../utils';
import type { Options } from '..';

/**
 * A rule that joins adjacent lists of the same type
 */
export function joinAdjacentLists(options: Options, editor: Editor): void {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry): void => {
    const [node, nodePath] = entry;

    if (isList(options)(node)) {
      let previousSiblingNodePath;
      let nextSiblingNodePath;
      try {
        previousSiblingNodePath = Path.previous(nodePath);
      } catch (e) {
        // skip for now
      }

      try {
        nextSiblingNodePath = Path.next(nodePath);
      } catch (e) {
        // skip for now
      }

      [previousSiblingNodePath, nextSiblingNodePath]
        .filter(Boolean)
        .forEach((siblingNodePath) => {
          const siblingNode = Node.get(editor, siblingNodePath);

          if (
            isList(options)(siblingNode) &&
            options.canMerge &&
            options.canMerge(node, siblingNode)
          ) {
            const targetNodeLastChildIndex = siblingNode.children.length - 1;

            Editor.withoutNormalizing(editor, () => {
              const targetNodePath = [
                ...siblingNodePath,
                // as the new last child of previous sibling list
                targetNodeLastChildIndex + 1,
              ];

              Transforms.insertNodes(editor, node.children, {
                at: targetNodePath,
              });

              Transforms.removeNodes(editor, {
                at: nodePath,
              });
            });
          }
        });
    }

    normalizeNode(entry);
  };
}
