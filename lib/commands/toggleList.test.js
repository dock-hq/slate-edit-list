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

  describe('when selection spans multiple columns', () => {
    let editorWithColumns;
    let TransformsWithColumns;

    beforeEach(() => {
      const plugins = EditListPlugin({
        blockTypesToKeepSeparate: ['columns'],
      });
      editorWithColumns = withReact(createEditor());
      editorWithColumns = plugins[0](editorWithColumns);
      TransformsWithColumns = plugins[2].Transforms;
    });

    it('removes lists from all columns when all have lists', () => {
      editorWithColumns.children = [
        {
          type: 'columns',
          children: [
            {
              type: 'column',
              children: [
                {
                  type: 'ul_list',
                  children: [
                    {
                      type: 'list_item',
                      children: [
                        {
                          type: 'paragraph',
                          children: [{ text: 'First item' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'column',
              children: [
                {
                  type: 'ul_list',
                  children: [
                    {
                      type: 'list_item',
                      children: [
                        {
                          type: 'paragraph',
                          children: [{ text: 'Second item' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      // Select paragraphs in both columns
      editorWithColumns.selection = {
        anchor: { path: [0, 0, 0, 0, 0, 0], offset: 0 },
        focus: { path: [0, 1, 0, 0, 0, 0], offset: 11 },
      };

      TransformsWithColumns.toggleList(editorWithColumns);

      const expected = [
        {
          type: 'columns',
          children: [
            {
              type: 'column',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'First item' }],
                },
              ],
            },
            {
              type: 'column',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Second item' }],
                },
              ],
            },
          ],
        },
      ];

      expect(editorWithColumns.children).toEqual(expected);
    });

    it('adds lists to all columns when none have lists', () => {
      editorWithColumns.children = [
        {
          type: 'columns',
          children: [
            {
              type: 'column',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'First item' }],
                },
              ],
            },
            {
              type: 'column',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Second item' }],
                },
              ],
            },
          ],
        },
      ];

      // Select paragraphs in both columns
      editorWithColumns.selection = {
        anchor: { path: [0, 0, 0, 0], offset: 0 },
        focus: { path: [0, 1, 0, 0], offset: 11 },
      };

      TransformsWithColumns.toggleList(editorWithColumns);

      const expected = [
        {
          type: 'columns',
          children: [
            {
              type: 'column',
              children: [
                {
                  type: 'ul_list',
                  children: [
                    {
                      type: 'list_item',
                      children: [
                        {
                          type: 'paragraph',
                          children: [{ text: 'First item' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'column',
              children: [
                {
                  type: 'ul_list',
                  children: [
                    {
                      type: 'list_item',
                      children: [
                        {
                          type: 'paragraph',
                          children: [{ text: 'Second item' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      expect(editorWithColumns.children).toEqual(expected);
    });

    it('adds lists to all columns when some have lists and some do not', () => {
      editorWithColumns.children = [
        {
          type: 'columns',
          children: [
            {
              type: 'column',
              children: [
                {
                  type: 'ul_list',
                  children: [
                    {
                      type: 'list_item',
                      children: [
                        {
                          type: 'paragraph',
                          children: [{ text: 'First item' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'column',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Second item' }],
                },
              ],
            },
          ],
        },
      ];

      // Select paragraphs in both columns
      editorWithColumns.selection = {
        anchor: { path: [0, 0, 0, 0, 0, 0], offset: 0 },
        focus: { path: [0, 1, 0, 0], offset: 11 },
      };

      TransformsWithColumns.toggleList(editorWithColumns);

      // Both columns should have lists now
      const expected = [
        {
          type: 'columns',
          children: [
            {
              type: 'column',
              children: [
                {
                  type: 'ul_list',
                  children: [
                    {
                      type: 'list_item',
                      children: [
                        {
                          type: 'paragraph',
                          children: [{ text: 'First item' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'column',
              children: [
                {
                  type: 'ul_list',
                  children: [
                    {
                      type: 'list_item',
                      children: [
                        {
                          type: 'paragraph',
                          children: [{ text: 'Second item' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      expect(editorWithColumns.children).toEqual(expected);
    });
  });

  describe('when selection spans multiple paragraphs in flat structure', () => {
    it('should wrap both paragraphs into list items', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'First paragraph' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Second paragraph' }],
        },
      ];

      // Select across both paragraphs
      Transforms.select(editor, {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [1, 0],
          offset: 16, // End of "Second paragraph"
        },
      });

      Transforms.toggleList(editor);

      const expected = [
        {
          type: 'ul_list',
          children: [
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'First paragraph' }],
                },
              ],
            },
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Second paragraph' }],
                },
              ],
            },
          ],
        },
      ];

      expect(editor.children).toEqual(expected);
    });

    it('should wrap multiple paragraphs when selection spans from middle of first to middle of last', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'First paragraph' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Second paragraph' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Third paragraph' }],
        },
      ];

      // Select from middle of first paragraph to middle of last paragraph
      Transforms.select(editor, {
        anchor: {
          path: [0, 0],
          offset: 5, // Middle of "First"
        },
        focus: {
          path: [2, 0],
          offset: 5, // Middle of "Third"
        },
      });

      Transforms.toggleList(editor);

      const expected = [
        {
          type: 'ul_list',
          children: [
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'First paragraph' }],
                },
              ],
            },
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Second paragraph' }],
                },
              ],
            },
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Third paragraph' }],
                },
              ],
            },
          ],
        },
      ];

      expect(editor.children).toEqual(expected);
    });

    it('should wrap both paragraphs when selection is backwards (anchor after focus)', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'First paragraph' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Second paragraph' }],
        },
      ];

      // Backwards selection: anchor is after focus (user selected from right to left)
      Transforms.select(editor, {
        anchor: {
          path: [1, 0],
          offset: 16, // End of "Second paragraph"
        },
        focus: {
          path: [0, 0],
          offset: 0, // Start of "First paragraph"
        },
      });

      Transforms.toggleList(editor);

      const expected = [
        {
          type: 'ul_list',
          children: [
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'First paragraph' }],
                },
              ],
            },
            {
              type: 'list_item',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Second paragraph' }],
                },
              ],
            },
          ],
        },
      ];

      expect(editor.children).toEqual(expected);
    });
  });
});
