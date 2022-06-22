import expect from 'expect';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const valueSimple = {
  input: [
    {
      type: 'something',
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
  output: [
    {
      type: 'something',
      children: [
        {
          type: 'paragraph',
          children: [{ text: 'Item 1' }],
        },
      ],
    },
  ],
};

const valueTopmost = {
  input: [
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
  output: [
    {
      type: 'paragraph',
      children: [{ text: 'Item 1' }],
    },
  ],
};

const valueValid = {
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

const [withEditList] = EditListPlugin();
let editor;

describe('itemsWithoutParentListAreUnwrapped', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  it('unwraps item in invalid parent', () => {
    Transforms.insertNodes(editor, valueSimple.input, {
      at: [0],
    });

    expect(editor.children).toEqual(valueSimple.output);
  });

  it('unwraps item when no parent', () => {
    Transforms.insertNodes(editor, valueTopmost.input, {
      at: [0],
    });

    expect(editor.children).toEqual(valueTopmost.output);
  });

  it('leaves item when valid parent', () => {
    Transforms.insertNodes(editor, valueValid.input, {
      at: [0],
    });

    expect(editor.children).toEqual(valueValid.output);
  });
});
