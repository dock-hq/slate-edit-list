// @flow
import expect from 'expect';
import { EditListPlugin } from '..';

const [, , { Element }] = EditListPlugin();

describe('isList util function', () => {
  it('should return true if node is a list type', () => {
    const element = {
      type: 'ul_list',
      children: [],
    };

    expect(Element.isList(element)).toBeTruthy();
  });

  it('should return false if node is not a list type', () => {
    const element = {
      type: 'paragraph',
      children: [],
    };

    expect(Element.isList(element)).toBeFalsy();
  });
});
