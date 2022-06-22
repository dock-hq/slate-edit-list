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
      try {
        previousSiblingNodePath = Path.previous(nodePath);
        const siblingNode = Node.get(editor, previousSiblingNodePath);

        if (
          isList(options)(siblingNode) &&
          options.canMerge &&
          options.canMerge(node, siblingNode)
        ) {
          const targetNodeLastChildIndex = siblingNode.children.length - 1;

          Editor.withoutNormalizing(editor, () => {
            const targetNodePath = [
              ...previousSiblingNodePath,
              // as the new last child of previous sibling list
              targetNodeLastChildIndex + 1,
            ];

            Transforms.insertNodes(editor, node.children, {
              at: targetNodePath,
            });

            Transforms.removeNodes(editor, {
              at: nodePath,
            });

            Transforms.select(editor, targetNodePath);
          });
        }
      } catch (e) {
        // skip for now
      }

      let nextSiblingNodePath;
      try {
        nextSiblingNodePath = Path.next(nodePath);
        const nextSiblingNode = Node.get(editor, nextSiblingNodePath);

        if (
          isList(options)(nextSiblingNode) &&
          options.canMerge &&
          options.canMerge(node, nextSiblingNode)
        ) {
          const targetNodeLastChildIndex = nextSiblingNode.children.length - 1;

          Editor.withoutNormalizing(editor, () => {
            const targetNodePath = [
              ...nextSiblingNodePath,
              // as the new first child of previous sibling list
              0,
            ];

            Transforms.insertNodes(editor, node.children, {
              at: targetNodePath,
            });

            Transforms.removeNodes(editor, {
              at: nodePath,
            });

            Transforms.select(editor, targetNodePath);
          });
        }
      } catch (e) {
        // skip for now
      }
    }

    normalizeNode(entry);
  };
}
