// @flow
import { Editor, type Element, type NodeEntry, type Path } from 'slate';
import { type Options } from '..';
import { isList } from '.';

/**
 * Return the parent list block for an item block.
 */
export const getListForItem = (options: Options) => (
  editor: Editor,
  path: Path
): ?NodeEntry<Element> =>
  Editor.above(editor, {
    at: path,
    match: (node) => isList(options)(node),
  }) || null;
