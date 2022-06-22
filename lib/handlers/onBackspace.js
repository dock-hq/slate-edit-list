// @flow
import { Editor, Range } from 'slate';

import { type Options } from '..';
import { unwrapList } from '../commands';
import { getCurrentItem } from '../utils';

/**
 * User pressed Delete in an editor
 */
export const onBackspace = (
  options: Options,
  event: *,
  editor: Editor
): void => {
  const { selection } = editor;

  // skip if selection is not collapsed
  if (!Range.isCollapsed(selection)) {
    return;
  }

  const currentItem = getCurrentItem(options)(editor);
  // skip if not a list item
  // or the selection not at the absolute start of the item
  if (
    !currentItem ||
    !Editor.isStart(editor, Range.start(selection), currentItem[1])
  ) {
    return;
  }

  event.preventDefault();
  unwrapList(options)(editor);
};
