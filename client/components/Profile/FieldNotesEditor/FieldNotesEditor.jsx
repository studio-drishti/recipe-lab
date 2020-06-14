import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const EditorConvertToHTML = () => {
  const [editorState, setEditor] = useState(EditorState.createEmpty());
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'link'],
        }}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={() => setEditor(editorState)}
      />
      <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  );
};
export default EditorConvertToHTML;
