// @flow
import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { EditListPlugin } from '..';

const [withEditList, , { Editor }] = EditListPlugin();
let editor;

describe('getListForItem util function', () => {
  beforeEach(() => {
    editor = withEditList(withReact(createEditor()));
  });

  it('should get the list parent for a list item', () => {
    const list = {
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
    };

    editor.children = [list];

    const path = [0, 0];

    expect(Editor.getListForItem(editor, path)).toEqual([list, [0]]);
  });

  it("should return null if list item doesn't have a list parent", () => {
    const list = {
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
    };

    editor.children = [list];

    const path = [0];

    expect(Editor.getListForItem(editor, path)).toBe(null);
  });

  it("should return null if list item's parent isn't a list", () => {
    const list = {
      type: 'paragraph',
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
    };

    editor.children = [list];

    const path = [0, 0];

    expect(Editor.getListForItem(editor, path)).toBe(null);
  });
});
