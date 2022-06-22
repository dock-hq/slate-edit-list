// @flow
/* global document */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';

import { Slate, Editable, withReact } from 'slate-react';

import { EditListPlugin } from '../lib';
import INITIAL_VALUE from './value';

const Example = () => {
  const [withEditList, onKeyDown, { Editor, Transforms }] = EditListPlugin();

  const editor = useMemo(
    () => withEditList(withHistory(withReact(createEditor()))),
    []
  );
  const renderElement = useCallback(({ attributes, children, element }: *) => {
    switch (element.type) {
      case 'ul_list':
        return <ul {...attributes}>{children}</ul>;
      case 'ol_list':
        return <ol {...attributes}>{children}</ol>;

      case 'list_item':
        return <li {...attributes}>{children}</li>;

      case 'heading':
        return <h1 {...attributes}>{children}</h1>;
      case 'paragraph':
      default:
        return <p {...attributes}>{children}</p>;
    }
  });
  // TODO: it needs to rerender when selection changes
  const renderToolbar = useCallback(() => {
    const inList = Editor.isSelectionInList(editor);

    return (
      <div>
        <button
          className={inList ? 'active' : ''}
          onClick={() =>
            inList
              ? Transforms.unwrapList(editor)
              : Transforms.wrapInList(editor)
          }
        >
          <i className="fa fa-list-ul fa-lg" />
        </button>

        <button
          className={inList ? '' : 'disabled'}
          onClick={() => Transforms.decreaseItemDepth(editor)}
        >
          <i className="fa fa-outdent fa-lg" />
        </button>

        <button
          className={inList ? '' : 'disabled'}
          onClick={() => Transforms.increaseItemDepth(editor)}
        >
          <i className="fa fa-indent fa-lg" />
        </button>

        <span className="sep">·</span>

        <button onClick={() => Transforms.wrapInList(editor)}>
          Wrap in list
        </button>
        <button onClick={() => Transforms.unwrapList(editor)}>
          Unwrap from list
        </button>

        <button onClick={() => Transforms.toggleList(editor, 'ol_list')}>
          Toggle ordered list
        </button>
        <button onClick={() => Transforms.toggleList(editor)}>
          Toggle unordered list
        </button>

        <button
          onClick={() => {
            console.log(JSON.stringify(editor.selection, null, 2));
            console.log(
              JSON.stringify(Editor.getItemsAtRange(editor), null, 2)
            );
          }}
        >
          Dump selection
        </button>
      </div>
    );
  });

  const [value, setValue] = useState(INITIAL_VALUE);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      {renderToolbar()}
      <Editable
        placeholder="Enter some text...."
        onKeyDown={onKeyDown(editor)}
        renderElement={renderElement}
      />
    </Slate>
  );
};

ReactDOM.render(<Example />, document.getElementById('example'));
