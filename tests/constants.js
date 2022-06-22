export const PARAGRAPH = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'Just a text',
      },
    ],
  },
];

export const SIMPLE_LIST = [
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
                text: 'List item',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const NESTED_LIST = [
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
                        text: 'Nested list item',
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

export const SIMPLE_NESTED_LIST = [
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
                        text: 'Item 21',
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

export const NESTED_LIST_MULTIPLE_NODES = [
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
                        text: 'Nested list item',
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
                text: 'List item',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const COMPLEX_LIST = [
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
                        text: 'Nested list item no. 1',
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

export const COMPLICATED_LIST = [
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
        ],
      },
    ],
  },
];
