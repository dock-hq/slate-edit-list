import expect from 'expect';
import { createEditor, Node, Transforms } from 'slate';
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
            children: [{ text: '1. of 2 paragraphs in item' }],
          },
          {
            type: 'paragraph',
            children: [{ text: '2. of 2 paragraphs in item' }],
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
                        key: 'first_nested_list_first_leaf_node',
                        text: 'Nested item',
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
                        key: 'first_nested_list_second_leaf_node',
                        text: 'Nested item',
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
                        key: 'first_nested_list_third_leaf_node',
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
  {
    type: 'paragraph',
    children: [{ text: 'Item' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Item' }],
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
                text: 'Item',
              },
            ],
          },
        ],
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
                text: 'Item',
              },
            ],
          },
        ],
      },
    ],
  },
];

const valueTraverseToEditor = [
  {
    type: 'something',
    children: [
      {
        type: 'something',
        children: [
          {
            type: 'something',
            children: [{ text: 'foo' }],
          },
          {
            type: 'something',
            children: [{ text: 'bar' }],
          },
        ],
      },
    ],
  },
];

const pathFirstNestedListFirstLeafNode = [0, 2, 0, 0, 0, 0];
const pathFirstNestedListSecondLeafNode = [0, 2, 0, 1, 0, 0];
const pathSecondNestedListLeafNode = [0, 2, 1, 0, 0, 0];
const pathParagraphLeafButLastNode = [1, 0];
const pathParagraphLeafLastNode = [2, 0];
const pathSecondTopmostList = [3, 0, 0, 0];
const pathLastTopmostList = [4, 0, 0, 0];
const pathOneItemFirstParagraph = [0, 0, 0, 0];
const pathOneItemSecondParagraph = [0, 0, 1, 0];

const buildExpectedNodeEntry = (editor, path) => [Node.get(editor, path), path];

const [withEditList, , { Editor }] = EditListPlugin();
let editor;

describe('getTopmostItemsAtRange', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
    editor.children = value;
  });

  describe('when no items in range', () => {
    it('returns empty list when single paragraph selected', () => {
      Transforms.select(editor, pathParagraphLeafButLastNode);

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      expect(listItemsArray).toEqual([]);
    });

    it('returns empty list when multiple paragraphs selected', () => {
      Transforms.select(editor, {
        anchor: { path: pathParagraphLeafButLastNode, offset: 0 },
        focus: { path: pathParagraphLeafLastNode, offset: 4 },
      });

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      expect(listItemsArray).toEqual([]);
    });
  });

  describe('when 1 item in range', () => {
    it('and selecting its 1 text node returns that item', () => {
      Transforms.select(editor, pathSecondNestedListLeafNode);

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      const expected = buildExpectedNodeEntry(editor, [0, 2, 1, 0]);

      expect(listItemsArray).toEqual([expected]);
    });

    it("and selecting across it's multiple text nodes returns that item", () => {
      Transforms.select(editor, {
        anchor: { path: pathOneItemFirstParagraph, offset: 0 },
        focus: { path: pathOneItemSecondParagraph, offset: 0 },
      });

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      const expected = buildExpectedNodeEntry(editor, [0, 0]);

      expect(listItemsArray).toEqual([expected]);
    });
  });

  describe('when more items in range', () => {
    it('on flat selection returns array of the items', () => {
      Transforms.select(editor, {
        anchor: { path: pathFirstNestedListFirstLeafNode, offset: 0 },
        focus: { path: pathFirstNestedListSecondLeafNode, offset: 0 },
      });

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      const expected = [
        buildExpectedNodeEntry(editor, [0, 2, 0, 0]),
        buildExpectedNodeEntry(editor, [0, 2, 0, 1]),
      ];

      expect(listItemsArray).toEqual(expected);
    });

    it('on nested lists selection returns array of top level items', () => {
      Transforms.select(editor, {
        anchor: { path: [0, 1, 0, 0], offset: 0 },
        focus: { path: [0, 2, 0, 0, 0, 0], offset: 0 },
      });

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      const expected = [
        buildExpectedNodeEntry(editor, [0, 1]),
        buildExpectedNodeEntry(editor, [0, 2]),
      ];

      expect(listItemsArray).toEqual(expected);
    });

    it('on multiple lists in selection returns topmost items of every list', () => {
      Transforms.select(editor, {
        anchor: { path: [0, 0, 0, 0], offset: 0 },
        focus: { path: pathSecondTopmostList, offset: 0 },
      });

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      const expected = [
        buildExpectedNodeEntry(editor, [0, 0]),
        buildExpectedNodeEntry(editor, [0, 1]),
        buildExpectedNodeEntry(editor, [0, 2]),
        buildExpectedNodeEntry(editor, [3, 0]),
      ];

      expect(listItemsArray).toEqual(expected);
    });

    it('when everything is selected returns all topmost items', () => {
      Transforms.select(editor, {
        anchor: { path: [0, 0, 0, 0], offset: 0 },
        focus: { path: pathLastTopmostList, offset: 0 },
      });

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      const expected = [
        buildExpectedNodeEntry(editor, [0, 0]),
        buildExpectedNodeEntry(editor, [0, 1]),
        buildExpectedNodeEntry(editor, [0, 2]),
        buildExpectedNodeEntry(editor, [3, 0]),
        buildExpectedNodeEntry(editor, [4, 0]),
      ];

      expect(listItemsArray).toEqual(expected);
    });
  });

  describe('when there are no lists', () => {
    it('when we check all ancestors up to the editor', () => {
      editor.children = valueTraverseToEditor;
      Transforms.select(editor, {
        anchor: { path: [0, 0, 0, 0], offset: 0 },
        focus: { path: [0, 0, 1, 0], offset: 0 },
      });

      const listItemsArray = Editor.getTopmostItemsAtRange(editor);

      expect(listItemsArray).toEqual([]);
    });
  });
});
