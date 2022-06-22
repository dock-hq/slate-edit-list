import expect from 'expect';
import { createEditor } from 'slate';
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
              children: [{ text: 'Item' }],
            },
          ],
        },
      ],
    },
  ],
  output: [
    {
      type: 'paragraph',
      children: [{ text: 'Item' }],
    },
  ],
};

const valueListMultiple = {
  input: [
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
              children: [{ text: 'Item' }],
            },
          ],
        },
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item' }],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Item' }],
    },
  ],
  output: [
    {
      type: 'paragraph',
      children: [{ text: 'Item' }],
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
      type: 'paragraph',
      children: [{ text: 'Item' }],
    },
  ],
};

const valueListMultipleNested = {
  input: [
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item' }],
            },
          ],
        },
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item' }],
            },
            {
              type: 'ol_list',
              children: [
                {
                  type: 'list_item',
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: 'Item' }],
                    },
                  ],
                },
                {
                  type: 'list_item',
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: 'Item' }],
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
              children: [{ text: 'Item' }],
            },
          ],
        },
      ],
    },
  ],
  output: [
    {
      type: 'paragraph',
      children: [{ text: 'Item' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Item' }],
    },
    {
      type: 'ol_list',
      children: [
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item' }],
            },
          ],
        },
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item' }],
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
              children: [{ text: 'Item' }],
            },
          ],
        },
      ],
    },
  ],
};

const valueSplitList = {
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
      children: [{ text: 'Item 2' }],
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

const valueSimpleNested = {
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
          ],
        },
      ],
    },
  ],
  output: [
    {
      type: 'paragraph',
      children: [{ text: 'Item 1' }],
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
  ],
};

const [, , { Transforms }] = EditListPlugin();
let editor;

describe('unwrapList', () => {
  beforeEach(() => {
    editor = withReact(createEditor());
  });

  describe('when one list and item', () => {
    it('transforms to plain paragraph', () => {
      editor.children = valueSimple.input;

      Transforms.select(editor, [0, 0, 0, 0]);
      Transforms.unwrapList(editor);

      expect(editor.children).toEqual(valueSimple.output);
    });

    it('splits existing list', () => {
      editor.children = valueSplitList.input;

      Transforms.select(editor, [0, 1, 0, 0]);
      Transforms.unwrapList(editor);

      expect(editor.children).toEqual(valueSplitList.output);
    });

    it('unwraps outer list', () => {
      editor.children = valueSimpleNested.input;

      Transforms.select(editor, [0, 0, 0, 0]);
      Transforms.unwrapList(editor);

      expect(editor.children).toEqual(valueSimpleNested.output);
    });
  });

  describe('when multiple selected', () => {
    it('returns expected output', () => {
      editor.children = valueListMultiple.input;

      Transforms.select(editor, {
        anchor: {
          path: [1, 0, 0, 0],
          offset: 0,
        },
        focus: {
          path: [1, 1, 0, 0],
          offset: 0,
        },
      });
      Transforms.unwrapList(editor);

      expect(editor.children).toEqual(valueListMultiple.output);
    });

    it('returns expected output', () => {
      editor.children = valueListMultipleNested.input;

      Transforms.select(editor, {
        anchor: {
          path: [0, 0, 0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 1, 1, 0, 0],
          offset: 0,
        },
      });
      Transforms.unwrapList(editor);

      expect(editor.children).toEqual(valueListMultipleNested.output);
    });
  });
});
