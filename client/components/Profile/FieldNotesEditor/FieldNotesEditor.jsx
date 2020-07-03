import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const Editor = dynamic(
  () => {
    return import('react-draft-wysiwyg').then((mod) => mod.Editor);
  },
  { loading: () => null, ssr: false }
);

const EditorConvertToHTML = () => {
  const [editorState, setEditor] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditor(editorState);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'link'],
        }}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
      />
      <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  );
};
export default EditorConvertToHTML;
