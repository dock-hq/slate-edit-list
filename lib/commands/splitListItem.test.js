import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';
import { SIMPLE_LIST } from '../../tests/constants';

const selectionPath = [0, 0, 0, 0];

const [, , { Transforms }] = EditListPlugin();
let editor;

describe('splitListItem command', () => {
  beforeEach(() => {
    editor = withReact(createEditor());
    editor.children = SIMPLE_LIST;
  });

  describe('should split a list item in two', () => {
    it('at the start of a node', () => {
      const expected = [
        {
          type: 'ul_list',
          children: [
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'List item',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      Transforms.select(editor, {
        anchor: {
          path: selectionPath,
          offset: 0,
        },
        focus: {
          path: selectionPath,
          offset: 0,
        },
      });
      Transforms.splitListItem(editor);

      expect(editor.children).toEqual(expected);
    });

    it('in the middle of a node', () => {
      const expected = [
        {
          type: 'ul_list',
          children: [
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'List',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: ' item',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      Transforms.select(editor, {
        anchor: {
          path: selectionPath,
          offset: 4,
        },
        focus: {
          path: selectionPath,
          offset: 4,
        },
      });
      Transforms.splitListItem(editor);

      expect(editor.children).toEqual(expected);
    });

    it('at the end of a node', () => {
      const expected = [
        {
          type: 'ul_list',
          children: [
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'List item',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      Transforms.select(editor, {
        anchor: {
          path: selectionPath,
          offset: 9,
        },
        focus: {
          path: selectionPath,
          offset: 9,
        },
      });
      Transforms.splitListItem(editor);

      expect(editor.children).toEqual(expected);
    });
  });
});
