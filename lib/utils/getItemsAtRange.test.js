import expect from 'expect';
import { createEditor, Node, Transforms } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const noItemsValue = [
  {
    type: 'paragraph',
    children: [{ text: 'P1' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'P2' }],
  },
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
                text: 'P in list',
              },
            ],
          },
        ],
      },
    ],
  },
];

const singleListValue = [
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
                text: 'Paragraph 1',
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
                text: 'Paragraph 2',
              },
            ],
          },
        ],
      },
    ],
  },
];

const singleListPartialValue = [
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
                text: 'Paragraph 1',
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
                text: 'Paragraph 2',
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
                text: 'Paragraph 3',
              },
            ],
          },
        ],
      },
    ],
  },
];

const nestedListValue = [
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
                text: 'Paragraph 1',
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
                text: 'Paragraph 2',
              },
            ],
          },
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
                        text: 'Paragraph 21',
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
                        text: 'Paragraph 22',
                      },
                    ],
                  },
                ],
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
                text: 'Paragraph 3',
              },
            ],
          },
        ],
      },
    ],
  },
];

const buildExpectedNodeEntry = (editor, path) => [Node.get(editor, path), path];

const [withEditList, , { Editor }] = EditListPlugin();
let editor;

describe('getItemsAtRange', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  describe('when no items in range', () => {
    it('returns empty list when single paragraph selected', () => {
      editor.children = noItemsValue;
      Transforms.select(editor, {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [1, 0],
          offset: 0,
        },
      });

      const listItemsArray = Editor.getItemsAtRange(editor);

      expect(listItemsArray).toEqual([]);
    });
  });

  describe('when more items in range', () => {
    it('and selecting all texts returns all items', () => {
      editor.children = singleListValue;
      Transforms.select(editor, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 1, 0, 0],
          offset: 0,
        },
      });

      const listItemsArray = Editor.getItemsAtRange(editor);

      expect(listItemsArray).toEqual([
        buildExpectedNodeEntry(editor, [0, 0]),
        buildExpectedNodeEntry(editor, [0, 1]),
      ]);
    });

    it('and selecting some texts returns only some items', () => {
      editor.children = singleListPartialValue;
      Transforms.select(editor, {
        anchor: {
          path: [0, 1, 0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 2, 0, 0],
          offset: 0,
        },
      });

      const listItemsArray = Editor.getItemsAtRange(editor);

      expect(listItemsArray).toEqual([
        buildExpectedNodeEntry(editor, [0, 1]),
        buildExpectedNodeEntry(editor, [0, 2]),
      ]);
    });

    it('and selecting in nested list return items in nested list and parent list item', () => {
      editor.children = nestedListValue;
      Transforms.select(editor, {
        anchor: {
          path: [0, 1, 1, 0, 0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 1, 1, 1, 0, 0],
          offset: 0,
        },
      });

      const listItemsArray = Editor.getItemsAtRange(editor);

      expect(listItemsArray).toEqual([
        buildExpectedNodeEntry(editor, [0, 1]),
        buildExpectedNodeEntry(editor, [0, 1, 1, 0]),
        buildExpectedNodeEntry(editor, [0, 1, 1, 1]),
      ]);
    });

    it('and selecting over nested list return items in nested list and parent list item', () => {
      editor.children = nestedListValue;
      Transforms.select(editor, {
        anchor: {
          path: [0, 1, 0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 2, 0, 0],
          offset: 0,
        },
      });

      const listItemsArray = Editor.getItemsAtRange(editor);

      expect(listItemsArray).toEqual([
        buildExpectedNodeEntry(editor, [0, 1]),
        buildExpectedNodeEntry(editor, [0, 1, 1, 0]),
        buildExpectedNodeEntry(editor, [0, 1, 1, 1]),
        buildExpectedNodeEntry(editor, [0, 2]),
      ]);
    });
  });
});
