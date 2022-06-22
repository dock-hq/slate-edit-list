import expect from 'expect';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const valueSimple = {
  input: [
    {
      type: 'ul_list',
      children: [],
    },
  ],
  output: [
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item 1' }],
            },
          ],
        },
      ],
    },
  ],
};

const valueMultiple = {
  input: [
    {
      type: 'ul_list',
      children: [],
    },
  ],
  output: [
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item 1' }],
            },
          ],
        },
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item 2' }],
            },
          ],
        },
      ],
    },
  ],
};

const [withEditList] = EditListPlugin();
let editor;

describe('childOfListIsAlwaysItem', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  describe('when node is direct child of list', () => {
    it('it gets wrapped in list item if not already', () => {
      editor.children = valueSimple.input;
      Transforms.insertNodes(
        editor,
        [
          {
            type: 'paragraph',
            children: [{ text: 'Item 1' }],
          },
        ],
        {
          at: [0, 0],
        }
      );

      expect(editor.children).toEqual(valueSimple.output);
    });

    it('it wraps all of them in list items if not already', () => {
      editor.children = valueMultiple.input;
      Transforms.insertNodes(
        editor,
        [
          {
            type: 'paragraph',
            children: [{ text: 'Item 1' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'Item 2' }],
          },
        ],
        {
          at: [0, 0],
        }
      );

      expect(editor.children).toEqual(valueMultiple.output);
    });
  });
});
