import expect from 'expect';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const value = {
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
                                                      type: 'ul_list',
                                                      children: [
                                                        {
                                                          type: 'list_item',
                                                          children: [
                                                            {
                                                              type: 'paragraph',
                                                              children: [
                                                                {
                                                                  text:
                                                                    'level 7A',
                                                                },
                                                              ],
                                                            },
                                                            {
                                                              type: 'paragraph',
                                                              children: [
                                                                {
                                                                  text:
                                                                    'level 7B',
                                                                },
                                                              ],
                                                            },
                                                            {
                                                              type: 'ul_list',
                                                              children: [
                                                                {
                                                                  type:
                                                                    'list_item',
                                                                  children: [
                                                                    {
                                                                      type:
                                                                        'paragraph',
                                                                      children: [
                                                                        {
                                                                          text:
                                                                            'level 8A',
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      type:
                                                                        'paragraph',
                                                                      children: [
                                                                        {
                                                                          text:
                                                                            'level 8B',
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
                                                      children: [
                                                        {
                                                          text: 'level 7A',
                                                        },
                                                      ],
                                                    },
                                                    {
                                                      type: 'paragraph',
                                                      children: [
                                                        {
                                                          text: 'level 7B',
                                                        },
                                                      ],
                                                    },
                                                    {
                                                      type: 'paragraph',
                                                      children: [
                                                        {
                                                          text: 'level 8A',
                                                        },
                                                      ],
                                                    },
                                                    {
                                                      type: 'paragraph',
                                                      children: [
                                                        {
                                                          text: 'level 8B',
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

const [withEditList] = EditListPlugin();
let editor;

describe('unwrapListsOverDepthLimit', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  describe('when lists over max depth', () => {
    it('unwraps all such lists and items', () => {
      Transforms.insertNodes(editor, value.input, {
        at: [0],
      });

      expect(editor.children).toEqual(value.output);
    });
  });
});
