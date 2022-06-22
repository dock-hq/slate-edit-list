import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const value = [
  {
    type: 'ul_list',
    children: [
      {
        type: 'list_item',
        key: 'previous_item',
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'First item' }],
          },
        ],
      },
      {
        type: 'list_item',
        key: 'normal_current_item',
        children: [
          {
            type: 'paragraph',
            children: [{ key: 'flat_list_leaf_node', text: 'Second item' }],
          },
        ],
      },
      {
        type: 'list_item',
        key: 'item_with_nesting',
        children: [
          {
            type: 'ul_list',
            children: [
              {
                type: 'list_item',
                key: 'nested_current_item',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        key: 'nested_list_leaf_node',
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
const pathNestedListLeafNode = [0, 2, 0, 0, 0, 0];

const [withEditList, , { Editor, Transforms }] = EditListPlugin();
let editor;

describe('getCurrentItem', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
    editor.children = value;
  });

  describe('from selection', () => {
    it('returns parent list item', () => {
      Transforms.select(editor, pathFlatListLeafNode);

      const [{ key }] = Editor.getCurrentItem(editor);

      expect(key).toBe('normal_current_item');
    });

    it('returns first parent list item', () => {
      Transforms.select(editor, pathNestedListLeafNode);

      const [{ key }] = Editor.getCurrentItem(editor);

      expect(key).toBe('nested_current_item');
    });
  });

  describe('from path', () => {
    it('returns parent list item', () => {
      const [{ key }] = Editor.getCurrentItem(editor, pathFlatListLeafNode);

      expect(key).toBe('normal_current_item');
    });

    it('returns first parent list item', () => {
      const [{ key }] = Editor.getCurrentItem(editor, pathNestedListLeafNode);

      expect(key).toBe('nested_current_item');
    });
  });
});
