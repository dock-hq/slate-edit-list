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
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item 1' }],
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
              children: [{ text: 'Item 2' }],
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
      ],
    },
  ],
};

const valueMultiple = {
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
    {
      type: 'ul_list',
      children: [
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
    {
      type: 'ul_list',
      children: [
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

const valueValidSeparation = {
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
    {
      type: 'paragraph',
      children: [{ text: 'Item intermediate' }],
    },
    {
      type: 'ul_list',
      children: [
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
    {
      type: 'ul_list',
      children: [
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
      ],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Item intermediate' }],
    },
    {
      type: 'ul_list',
      children: [
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

const valueDifferentListTypes = {
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
    {
      type: 'ol_list',
      children: [
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
    {
      type: 'ul_list',
      children: [
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

const [withEditList] = EditListPlugin();
let editor;

describe('joinAdjacentLists', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  describe('when more lists follow each other', () => {
    it('joins two into one list', () => {
      Transforms.insertNodes(editor, valueSimple.input, {
        at: [0],
      });

      expect(editor.children).toEqual(valueSimple.output);
    });

    it('joins three into one list', () => {
      Transforms.insertNodes(editor, valueMultiple.input, {
        at: [0],
      });

      expect(editor.children).toEqual(valueMultiple.output);
    });

    it('joins only lists that are immediately after each other', () => {
      Transforms.insertNodes(editor, valueValidSeparation.input, {
        at: [0],
      });

      expect(editor.children).toEqual(valueValidSeparation.output);
    });

    it('joins only lists that are of a same type', () => {
      Transforms.insertNodes(editor, valueDifferentListTypes.input, {
        at: [0],
      });

      expect(editor.children).toEqual(valueDifferentListTypes.input);
    });
  });
});
