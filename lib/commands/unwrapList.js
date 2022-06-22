// @flow
import { Editor, NodeEntry, Transforms } from 'slate';
import { type Options } from '..';
import { getTopmostItemsAtRange } from '../utils';

/**
 * Unwrap items at range from their list.
 */
export const unwrapList = (options: Options) => (editor: Editor): void => {
  const items: Array<NodeEntry> = getTopmostItemsAtRange(options)(editor);

  if (items.length === 0) {
    return;
  }

  Editor.withoutNormalizing(editor, () => {
    const itemPaths = items.map(([, itemPath]) =>
      Editor.pathRef(editor, itemPath)
    );

    itemPaths.forEach((itemPath) => {
      Transforms.liftNodes(editor, {
        at: itemPath.current,
      });
      Transforms.unwrapNodes(editor, {
        at: itemPath.current,
      });
      itemPath.unref();
    });
  });
};
