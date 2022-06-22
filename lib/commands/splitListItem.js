// @flow
import { type Editor, Transforms } from 'slate';
import { type Options } from '..';
import { isItem } from '../utils';

/**
 * Split a list item at the start of the current range.
 */
export const splitListItem = (options: Options) => (editor: Editor): void =>
  Transforms.splitNodes(editor, {
    match: (n) => isItem(options)(n),
    always: true,
  });
