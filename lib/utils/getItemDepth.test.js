import expect from 'expect';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import {
  COMPLICATED_LIST,
  NESTED_LIST,
  PARAGRAPH,
  SIMPLE_LIST,
} from '../../tests/constants';
import { EditListPlugin } from '..';

const [withEditList, , { Editor }] = EditListPlugin();
let editor;

describe('getItemDepth util function', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  describe('from selection', () => {
    it("should return 0 if there isn't any list item in tree", () => {
      editor.children = PARAGRAPH;

      Transforms.select(editor, [0]);

      expect(Editor.getItemDepth(editor)).toBe(0);
    });

    it('should return 1 for a simple list', () => {
      editor.children = SIMPLE_LIST;

      Transforms.select(editor, [0]);

      expect(Editor.getItemDepth(editor)).toBe(1);
    });

    it('should return 2 for a nested list', () => {
      editor.children = NESTED_LIST;

      Transforms.select(editor, [0]);

      expect(Editor.getItemDepth(editor)).toBe(2);
    });

    it('should return 5 for a complicated list', () => {
      editor.children = COMPLICATED_LIST;

      Transforms.select(editor, [0]);

      expect(Editor.getItemDepth(editor)).toBe(5);
    });
  });

  describe('from path', () => {
    it("should return 0 if there isn't any list item in tree", () => {
      editor.children = PARAGRAPH;

      expect(Editor.getItemDepth(editor, [0, 0])).toBe(0);
    });

    it('should return 1 for a simple list', () => {
      editor.children = SIMPLE_LIST;

      expect(Editor.getItemDepth(editor, [0, 0, 0, 0])).toBe(1);
    });

    it('should return 2 for a nested list', () => {
      editor.children = NESTED_LIST;

      expect(Editor.getItemDepth(editor, [0, 0, 0, 0, 0, 0])).toBe(2);
    });

    it('should return 5 for a complicated list', () => {
      editor.children = COMPLICATED_LIST;

      expect(
        Editor.getItemDepth(editor, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      ).toBe(5);
    });
  });
});
