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
      // Check if node still exists (might have been removed in previous normalization)
      if (!Node.has(editor, nodePath)) {
        normalizeNode(entry);
        return;
      }

      try {
        const previousSiblingNodePath = Path.previous(nodePath);
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
              select: true,
            });

            Transforms.removeNodes(editor, {
              at: nodePath,
            });
          });
          // Return early after removing node - normalization will continue
          return;
        }
      } catch (e) {
        // skip for now
      }

      // Check again if node still exists before checking next sibling
      if (!Node.has(editor, nodePath)) {
        normalizeNode(entry);
        return;
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
          Editor.withoutNormalizing(editor, () => {
            const targetNodePath = [
              ...nextSiblingNodePath,
              // as the new first child of next sibling list
              0,
            ];

            Transforms.insertNodes(editor, node.children, {
              at: targetNodePath,
              select: true,
            });

            Transforms.removeNodes(editor, {
              at: nodePath,
            });
          });
          // Return early after removing node - normalization will continue
          return;
        }
      } catch (e) {
        // skip for now
      }
    }

    normalizeNode(entry);
  };
}
