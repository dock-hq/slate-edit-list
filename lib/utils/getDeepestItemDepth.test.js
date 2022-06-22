import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';
import {
  PARAGRAPH,
  NESTED_LIST,
  SIMPLE_LIST,
  NESTED_LIST_MULTIPLE_NODES,
} from '../../tests/constants';

const [withEditList, , { Editor }] = EditListPlugin();
let editor;

describe('getDeepestItemDepth util function', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  it('should return 0 if there are no list items', () => {
    editor.children = PARAGRAPH;

    expect(Editor.getDeepestItemDepth(editor, [])).toBe(0);
  });

  it('should return 2 for a simple list', () => {
    editor.children = SIMPLE_LIST;

    expect(Editor.getDeepestItemDepth(editor, [])).toBe(2);
  });

  it('should return 4 for a nested list', () => {
    editor.children = NESTED_LIST;

    expect(Editor.getDeepestItemDepth(editor, [])).toBe(4);
  });

  it('should return 1 for a list if entry path refers to a direct parent', () => {
    editor.children = NESTED_LIST;

    expect(Editor.getDeepestItemDepth(editor, [0, 0, 0])).toBe(1);
  });

  it('should return 3 for a list if entry path refers to a top-most list', () => {
    editor.children = NESTED_LIST;

    expect(Editor.getDeepestItemDepth(editor, [0])).toBe(3);
  });

  it('should return 3 for a list with multiple nodes with different depths', () => {
    editor.children = NESTED_LIST_MULTIPLE_NODES;

    expect(Editor.getDeepestItemDepth(editor, [0])).toBe(3);
  });
});
