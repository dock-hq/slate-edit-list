import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import {
  COMPLEX_LIST,
  COMPLICATED_LIST,
  NESTED_LIST,
  NESTED_LIST_MULTIPLE_NODES,
  PARAGRAPH,
  SIMPLE_LIST,
  SIMPLE_NESTED_LIST,
} from '../../tests/constants';
import { EditListPlugin } from '..';

const [, , { Transforms }] = EditListPlugin();
let editor;

describe('decreaseItemDepth command function', () => {
  beforeEach(() => {
    editor = withReact(createEditor());
  });

  it("shouldn't do anything if there are no lists", () => {
    editor.children = PARAGRAPH;
    const expected = PARAGRAPH;

    Transforms.select(editor, [0, 0]);
    Transforms.decreaseItemDepth(editor);

    expect(editor.children).toEqual(expected);
  });

  it("shouldn't do anything if the list is already top level", () => {
    editor.children = SIMPLE_LIST;
    const expected = SIMPLE_LIST;

    Transforms.select(editor, [0, 0, 0, 0]);
    Transforms.decreaseItemDepth(editor);

    expect(editor.children).toEqual(expected);
  });

  describe('should decrease item depth', () => {
    it('for a simple nested list', () => {
      editor.children = NESTED_LIST;
      const expected = [
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
                      text: 'Nested list item',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      Transforms.select(editor, [0, 0, 0, 0, 0, 0]);
      Transforms.decreaseItemDepth(editor);

      expect(editor.children).toEqual(expected);
    });

    it('for a list with multiple nodes and a nested list', () => {
      editor.children = NESTED_LIST_MULTIPLE_NODES;
      const expected = [
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
                      text: 'Nested list item',
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
                      text: 'List item',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      Transforms.select(editor, [0, 0, 0, 0, 0, 0]);
      Transforms.decreaseItemDepth(editor);

      expect(editor.children).toEqual(expected);
    });

    it('for a complex list', () => {
      editor.children = COMPLEX_LIST;
      const expected = [
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
                      text: 'Nested list item no. 1',
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
                              text: 'Nested list item no. 2',
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
                              text: 'Nested list item no. 3',
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
                      text: 'List item no. 2',
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
                      text: 'List item no. 3',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      Transforms.select(editor, [0, 0, 0, 0, 0]);
      Transforms.decreaseItemDepth(editor);

      expect(editor.children).toEqual(expected);
    });

    it('for a complicated list', () => {
      editor.children = COMPLICATED_LIST;
      const expected = [
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
                                              text: 'Complicated list item',
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
      ];

      Transforms.select(editor, [0, 0, 0, 0, 0, 0]);
      Transforms.decreaseItemDepth(editor);

      expect(editor.children).toEqual(expected);
    });

    it('for a simple nested list', () => {
      editor.children = SIMPLE_NESTED_LIST;
      const expected = [
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
                      text: 'Item 1',
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
                      text: 'Item 2',
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
                      text: 'Item 21',
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
                              text: 'Item 22',
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
      ];

      Transforms.select(editor, [0, 1, 1, 0, 0, 0]);
      Transforms.decreaseItemDepth(editor);

      expect(editor.children).toEqual(expected);
    });
  });
});
