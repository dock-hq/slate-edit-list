import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const valueSingleElement = {
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

const valueSingleNestedElement = {
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
              children: [{ text: 'Item' }],
            },
          ],
        },
      ],
    },
  ],
};

const valueSingleElementWithContent = {
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
              type: 'paragraph',
              children: [{ text: 'Item 2' }],
            },
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
      type: 'paragraph',
      children: [{ text: 'Item 1' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Item 2' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Item 3' }],
    },
  ],
};

const valueNestedSameListSelectionLast = {
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
      type: 'paragraph',
      children: [{ text: 'Item 3' }],
    },
  ],
};

const valueNestedSameListSelectionFirst = {
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
      type: 'paragraph',
      children: [{ text: 'Item 1' }],
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

const valueNestedListSelection = {
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
            {
              type: 'ul_list',
              children: [
                {
                  type: 'list_item',
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: 'Item 2-1' }],
                    },
                  ],
                },
                {
                  type: 'list_item',
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: 'Item 2-2' }],
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
      type: 'paragraph',
      children: [{ text: 'Item 2-1' }],
    },
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Item 2-2' }],
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

const valueNestedListSelectionParentEditor = {
  input: [
    {
      type: 'paragraph',
      children: [{ text: 'Item 1' }],
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
  output: [
    {
      type: 'paragraph',
      children: [{ text: 'Item 1' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Item 2' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Item 3' }],
    },
  ],
};

const [withEditList, , { Transforms }] = EditListPlugin();
let editor;

describe('toggleList', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  describe('when one block in selection', () => {
    it('transforms a single item list to item content', () => {
      editor.children = valueSingleElement.input;

      Transforms.select(editor, [0, 0, 0, 0]);
      Transforms.toggleList(editor);

      expect(editor.children).toEqual(valueSingleElement.output);
    });

    it('transforms a paragraph into list and item', () => {
      editor.children = valueSingleElement.output;

      Transforms.select(editor, [0, 0]);
      Transforms.toggleList(editor);

      expect(editor.children).toEqual(valueSingleElement.input);
    });

    it('transforms a single item list to item content while leaving parent list intact', () => {
      editor.children = valueSingleNestedElement.input;

      Transforms.select(editor, [0, 0, 0, 0, 0, 0]);
      Transforms.toggleList(editor);

      expect(editor.children).toEqual(valueSingleNestedElement.output);
    });

    // TODO inverse

    it('transforms a single item list to item content when selected anywhere in item', () => {
      editor.children = valueSingleElementWithContent.input;

      Transforms.select(editor, [0, 0, 2]);
      Transforms.toggleList(editor);

      expect(editor.children).toEqual(valueSingleElementWithContent.output);
    });

    // TODO inverse
  });

  describe('when multiple block in selection of same list', () => {
    it('and selection at the end transforms to correct output', () => {
      editor.children = valueNestedSameListSelectionLast.input;

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
      Transforms.toggleList(editor);

      expect(editor.children).toEqual(valueNestedSameListSelectionLast.output);
    });

    it('and selection at the start transforms to correct output', () => {
      editor.children = valueNestedSameListSelectionFirst.input;

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
      Transforms.toggleList(editor);

      expect(editor.children).toEqual(valueNestedSameListSelectionFirst.output);
    });
  });

  describe('when multiple block in selection of different lists', () => {
    it('unwraps correct lists', () => {
      editor.children = valueNestedListSelection.input;

      Transforms.select(editor, {
        anchor: {
          path: [0, 1, 0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 1, 1, 0, 0, 0],
          offset: 0,
        },
      });
      Transforms.toggleList(editor);

      expect(editor.children).toEqual(valueNestedListSelection.output);
    });

    it('when selection ancestor is editor unwraps correct lists', () => {
      editor.children = valueNestedListSelectionParentEditor.input;

      Transforms.select(editor, {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [1, 0, 0, 0],
          offset: 0,
        },
      });
      Transforms.toggleList(editor);

      expect(editor.children).toEqual(
        valueNestedListSelectionParentEditor.output
      );
    });
  });
});
