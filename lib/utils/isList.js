// @flow
import { Element, type Node } from 'slate';
import { type Options } from '..';

/**
 * True if the node is a list container
 */
export const isList = ({ types }: Options) => (node: Node): boolean =>
  Element.isElement(node) && types.includes(node.type);
