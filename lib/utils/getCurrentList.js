// @flow
import { Editor, NodeEntry, Path } from 'slate';
import { type Options } from '..';
import { getCurrentItem, getListForItem } from '.';

/**
 * Return the parent list block, from current selection or from a node (paragraph in a list item).
 */
export const getCurrentList = (options: Options) => (
  editor: Editor,
  path?: Path
): ?NodeEntry<Element> => {
  const itemEntry = getCurrentItem(options)(editor, path);

  if (!itemEntry) {
    return null;
  }

  const [, itemPath] = itemEntry;

  return getListForItem(options)(editor, itemPath);
};
