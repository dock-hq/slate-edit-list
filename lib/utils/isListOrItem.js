// @flow
import { type Node } from 'slate';
import { type Options } from '..';
import { isList } from './isList';
import { isItem } from './isItem';

export const isListOrItem = (options: Options) => (node: Node): boolean =>
  isList(options)(node) || isItem(options)(node);
