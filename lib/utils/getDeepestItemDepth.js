// @flow
import { Editor, type Path } from 'slate';
import { type Options } from '..';
import { isItem } from '.';

/**
 * Find all `list_item` descendants of a node and retrieve the deepest depth.
 */

export const getDeepestItemDepth = (options: Options) => (
  editor: Editor,
  path: Path
): number =>
  [
    ...Editor.nodes(editor, {
      at: path,
      match: isItem(options),
    }),
  ].reduce(
    (maxLevel, [, itemPath]) =>
      Math.max(maxLevel, itemPath.length - path.length),
    0
  );
