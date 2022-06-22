// @flow
import expect from 'expect';
import { EditListPlugin } from '..';

const [, , { Element }] = EditListPlugin();

describe('isItem util function', () => {
  it('should return true if node is of list item type', () => {
    const element = {
      type: 'list_item',
      children: [],
    };

    expect(Element.isItem(element)).toBeTruthy();
  });

  it('should return false if node is not of list item type', () => {
    const element = {
      type: 'paragraph',
      children: [],
    };

    expect(Element.isItem(element)).toBeFalsy();
  });
});
