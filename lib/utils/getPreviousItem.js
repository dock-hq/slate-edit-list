// @flow
import { Editor, Element, Node, NodeEntry, Path } from 'slate';
import { type Options } from '..';
import { getCurrentItem } from '.';

/**
 * Return the previous item, from current selection or from a node.
 */
export const getPreviousItem = (options: Options) => (
  editor: Editor,
  path?: Path
): ?NodeEntry<Element> => {
  const [currentItem, currentItemPath] = getCurrentItem(options)(editor, path);
  if (!currentItem) {
    return null;
  }

  let previousSiblingPath = null;

  try {
    previousSiblingPath = Path.previous(currentItemPath);
  } catch (e) {
    // Slate throws when trying to find
    // previous of a first element
    // we interpret it as there not being a previous item
    return null;
  }

  const previousSibling = Node.get(editor, previousSiblingPath);

  if (!previousSibling) {
    return null;
  } else if (previousSibling.type === options.typeItem) {
    return [previousSibling, previousSiblingPath];
  }
  return null;
};
