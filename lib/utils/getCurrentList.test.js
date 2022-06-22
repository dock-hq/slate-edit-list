import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const value = [
  {
    type: 'ul_list',
    key: 'first_top_list',
    children: [
      {
        type: 'list_item',
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'First item' }],
          },
        ],
      },
      {
        type: 'list_item',
        children: [
          {
            type: 'paragraph',
            children: [{ key: 'flat_list_leaf_node', text: 'Second item' }],
          },
        ],
      },
      {
        type: 'list_item',
        children: [
          {
            type: 'ul_list',
            key: 'first_nested_list',
            children: [
              {
                type: 'list_item',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        key: 'first_nested_list_leaf_node',
                        text: 'Nested item',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'ul_list',
            key: 'second_nested_list',
            children: [
              {
                type: 'list_item',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        key: 'second_nested_list_leaf_node',
                        text: 'Nested item',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const pathFlatListLeafNode = [0, 1, 0, 0];
const pathFirstNestedListLeafNode = [0, 2, 0, 0, 0, 0];
const pathSecondNestedListLeafNode = [0, 2, 1, 0, 0, 0];

const [withEditList, , { Editor, Transforms }] = EditListPlugin();
let editor;

describe('getCurrentList', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
    editor.children = value;
  });

  describe('from selection', () => {
    it('returns list', () => {
      Transforms.select(editor, pathFlatListLeafNode);

      const [{ key }] = Editor.getCurrentList(editor);

      expect(key).toBe('first_top_list');
    });

    it('returns first parent list', () => {
      Transforms.select(editor, pathFirstNestedListLeafNode);

      const [{ key }] = Editor.getCurrentList(editor);

      expect(key).toBe('first_nested_list');
    });

    it('returns first of 2 siblings list', () => {
      Transforms.select(editor, pathFirstNestedListLeafNode);

      const [{ key }] = Editor.getCurrentList(editor);

      expect(key).toBe('first_nested_list');
    });

    it('returns second of 2 siblings list', () => {
      Transforms.select(editor, pathSecondNestedListLeafNode);

      const [{ key }] = Editor.getCurrentList(editor);

      expect(key).toBe('second_nested_list');
    });
  });

  describe('from path', () => {
    it('returns list', () => {
      const [{ key }] = Editor.getCurrentList(editor, pathFlatListLeafNode);

      expect(key).toBe('first_top_list');
    });

    it('returns first parent list', () => {
      const [{ key }] = Editor.getCurrentList(
        editor,
        pathFirstNestedListLeafNode
      );

      expect(key).toBe('first_nested_list');
    });

    it('returns first of 2 siblings list', () => {
      const [{ key }] = Editor.getCurrentList(
        editor,
        pathFirstNestedListLeafNode
      );

      expect(key).toBe('first_nested_list');
    });

    it('returns second of 2 siblings list', () => {
      const [{ key }] = Editor.getCurrentList(
        editor,
        pathSecondNestedListLeafNode
      );

      expect(key).toBe('second_nested_list');
    });
  });
});
