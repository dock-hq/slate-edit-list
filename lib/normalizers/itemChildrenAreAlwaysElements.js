// @flow
import { Editor, NodeEntry, Node, Transforms, Element } from 'slate';

import { isItem } from '../utils';
import type { Options } from '..';

const createWrapperNode = (wrapperType: string): Node => ({
  type: wrapperType,
  children: [],
});

/**
 * Generates new children by carrying over elements and grouping all
 * non element nodes under a new wrapper node
 */
const getNewChildren = (
  editor: Editor,
  children: Array<Node>,
  wrapperType: string,
): Array<Node> => {
  const newChildren = [];
  let needsNewWrapper = true;

  children.forEach(child => {
    if (Element.isElement(child) && !editor.isInline(child)) {
      newChildren.push(child);
      needsNewWrapper = true;

      return;
    }

    let currentGroup: Node = newChildren[newChildren.length - 1];
    const shouldCreateNewGroup = !currentGroup || needsNewWrapper;

    if (shouldCreateNewGroup) {
      currentGroup = createWrapperNode(wrapperType);
      newChildren.push(currentGroup);
      needsNewWrapper = false;
    }

    currentGroup.children.push(child);
  });

  return newChildren;
};

/**
 * A rule that wraps children of lists with list item
 */
export function itemChildrenAreAlwaysElements(
  options: Options,
  editor: Editor,
): void {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry): void => {
    const [node, nodePath] = entry;

    if (!isItem(options)(node) || node.children.length === 0) {
      normalizeNode(entry);
      return;
    }

    const hasTexts = node.children.some(child => !Element.isElement(child));
    if (hasTexts) {
      const newChildren = getNewChildren(
        editor,
        node.children,
        options.typeDefault,
      );

      Editor.withoutNormalizing(editor, () => {
        Transforms.removeNodes(editor, { at: nodePath });
        const newNode = {
          ...node,
          children: newChildren,
        };
        Transforms.insertNodes(editor, newNode, { at: nodePath });
      });
      return;
    }

    normalizeNode(entry);
  };
}
