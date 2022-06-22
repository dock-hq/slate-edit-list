import expect from 'expect';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const valueSimple = {
  input: [
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
          children: [],
        },
      ],
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

const valueIntermediate = {
  input: [
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
          children: [],
        },
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item 3' }],
            },
          ],
        },
      ],
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
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item 3' }],
            },
          ],
        },
      ],
    },
  ],
};

const valueNestedList = {
  input: [
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
          children: [
            {
              type: 'ol_list',
              children: [
                {
                  type: 'list_item',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
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
              type: 'ol_list',
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
        },
      ],
    },
  ],
};

const valueSingleItem = {
  input: [
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
          children: [
            { text: 'first ', bold: true },
            { text: 'second', italic: true },
            {
              type: 'paragraph',
              children: [{ text: 'Another paragraph' }],
            },
            { text: 'third ', underline: true },
            {
              type: 'paragraph',
              children: [{ text: 'Another paragraph' }],
            },
            { text: 'fourth', italic: true },
            { text: 'fifth', whatever: true },
            { type: 'link', children: [{ text: 'link text' }] },
          ],
        },
      ],
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
              children: [
                { text: 'first ', bold: true },
                { text: 'second', italic: true },
              ],
            },
            {
              type: 'paragraph',
              children: [{ text: 'Another paragraph' }],
            },
            {
              type: 'paragraph',
              children: [{ text: 'third ', underline: true }],
            },
            {
              type: 'paragraph',
              children: [{ text: 'Another paragraph' }],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'fourth', italic: true },
                { text: 'fifth', whatever: true },
                {
                  type: 'link',
                  children: [{ text: 'link text' }],
                },
                { text: '' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const [withEditList] = EditListPlugin();
let editor;

describe('itemChildrenAreAlwaysElements', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
    editor.isInline = (element) => element.type === 'link';
  });

  it('it wraps item child with default element if not element', () => {
    editor.children = valueSimple.input;
    Transforms.insertNodes(editor, [{ text: 'Item 1' }], {
      at: [0, 0, 0],
    });

    expect(editor.children).toEqual(valueSimple.output);
  });

  it('it does not affect surrounding items in list by wrapping', () => {
    editor.children = valueIntermediate.input;
    Transforms.insertNodes(editor, [{ text: 'Item 2' }], {
      at: [0, 1, 0],
    });

    expect(editor.children).toEqual(valueIntermediate.output);
  });

  it('it works in deeply nested list items', () => {
    editor.children = valueNestedList.input;
    Transforms.insertNodes(editor, [{ text: 'Item 1' }], {
      at: [0, 0, 0, 0, 0],
    });

    expect(editor.children).toEqual(valueNestedList.output);
  });

  it('it works with single list item with marks', () => {
    Transforms.insertNodes(editor, valueSingleItem.input);

    expect(editor.children).toEqual(valueSingleItem.output);
  });
});
