// @flow
import { type Editor, Range } from 'slate';

import { type Options } from '..';
import { decreaseItemDepth, increaseItemDepth } from '../commands';
import { getCurrentItem } from '../utils';

/**
 * User pressed Tab in an editor.
 * Tab       -> Increase item depth if inside a list item
 * Shift+Tab -> Decrease item depth if inside a list item
 */
export const onTab = (options: Options, event: *, editor: Editor): void => {
  if (Range.isExpanded(editor.selection) || !getCurrentItem(options)(editor)) {
    return;
  }

  event.preventDefault();

  // Shift+tab reduce depth
  if (event.shiftKey) {
    decreaseItemDepth(options)(editor);
  } else {
    // Tab increases depth
    increaseItemDepth(options)(editor);
  }
};
