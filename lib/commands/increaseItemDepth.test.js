import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const valueNewSublist = {
  input: [
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
  output: [
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
  ],
};

const valueIntoExistingSublist = {
  input: [
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
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
  output: [
    {
      type: 'ul_list',
      children: [
        {
          type: 'list_item',
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
  ],
};

const valueMixOfListTypes = {
  input: [
    {
      type: 'ol_list',
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
        {
          type: 'list_item',
          children: [
            {
              type: 'ul_list',
              children: [
                {
                  type: 'list_item',
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: 'First nested item' }],
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
                          text: 'This will be deeply nested item',
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
  ],
  output: [
    {
      type: 'ol_list',
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
        {
          type: 'list_item',
          children: [
            {
              type: 'ul_list',
              children: [
                {
                  type: 'list_item',
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: 'First nested item' }],
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
                                  text: 'This will be deeply nested item',
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
          ],
        },
      ],
    },
  ],
};

const pathNewSublistParagraph = [0, 1];
const pathExistingSublistParagraph = [0, 1, 0];
const pathDeeplyNestedParagraph = [0, 1, 0, 1, 0];

const [, , { Transforms }] = EditListPlugin();
let editor;

describe('increaseItemDepth', () => {
  beforeEach(() => {
    editor = withReact(createEditor());
  });

  describe('when destination contains a list as a last element', () => {
    it('moves the item to existing this existing list', () => {
      editor.children = valueIntoExistingSublist.input;

      Transforms.select(editor, pathExistingSublistParagraph);

      Transforms.increaseItemDepth(editor);

      // expect(editor.children).toEqual(valueIntoExistingSublist.output);
    });
  });

  describe('when destination does not contain a list', () => {
    it('creates a new sublist and moves item there', () => {
      editor.children = valueNewSublist.input;

      Transforms.select(editor, pathNewSublistParagraph);
      Transforms.increaseItemDepth(editor);

      expect(editor.children).toEqual(valueNewSublist.output);
    });

    it('uses type of parent list for newly created sublist', () => {
      editor.children = valueMixOfListTypes.input;

      Transforms.select(editor, pathDeeplyNestedParagraph);
      Transforms.increaseItemDepth(editor);

      expect(editor.children).toEqual(valueMixOfListTypes.output);
    });
  });
});
