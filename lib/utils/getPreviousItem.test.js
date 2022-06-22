import expect from 'expect';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const pathFirstLeafNode = [0, 0, 0, 0];
const pathSecondLeafNode = [0, 1, 0, 0];

const [withEditList, , { Editor }] = EditListPlugin();
let editor;

describe('getPreviousItem', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
    editor.children = [
      {
        type: 'ul_list',
        children: [
          {
            type: 'list_item',
            key: 'previous_item',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    key: 'first_leaf_node',
                    text: 'First item',
                  },
                ],
              },
            ],
          },
          {
            type: 'list_item',
            key: 'current_item',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    key: 'second_leaf_node',
                    text: 'Second item',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  });

  describe('from selection', () => {
    it('returns parent list item', () => {
      Transforms.select(editor, pathSecondLeafNode);

      const [currentItem] = Editor.getPreviousItem(editor);

      expect(currentItem.key).toBe('previous_item');
    });
  });

  describe('from path', () => {
    it('returns parent list item', () => {
      const [currentItem] = Editor.getPreviousItem(editor, pathSecondLeafNode);

      expect(currentItem.key).toBe('previous_item');
    });
  });

  describe('when first list element', () => {
    it('returns null', () => {
      const currentItem = Editor.getPreviousItem(editor, pathFirstLeafNode);

      expect(currentItem).toBe(null);
    });
  });
});
