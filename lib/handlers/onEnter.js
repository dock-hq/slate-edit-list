// @flow
import { Editor, Node } from 'slate';

import { type Options } from '..';
import { unwrapList, splitListItem, decreaseItemDepth } from '../commands';
import { getCurrentItem, getItemDepth } from '../utils';

/**
 * User pressed Enter in an editor
 *
 * Enter in a list item should split the list item
 * Enter in an empty list item should remove it
 * Shift+Enter in a list item should make a new line
 */
export const onEnter = (options: Options, event: *, editor: Editor): void => {
  const isShiftPressed = event.shiftKey;
  const currentItem = getCurrentItem(options)(editor);

  if (isShiftPressed || !currentItem) {
    return;
  }

  const [currentItemNode] = currentItem;

  event.preventDefault();

  editor.deleteFragment();

  if (!Editor.isVoid(currentItemNode) && Node.string(currentItemNode) === '') {
    // Block is empty, we exit the list
    if (getItemDepth(options)(editor) > 1) {
      decreaseItemDepth(options)(editor);
    } else {
      // Exit list
      unwrapList(options)(editor);
    }
  } else {
    // Split list item
    splitListItem(options)(editor);
  }
};
