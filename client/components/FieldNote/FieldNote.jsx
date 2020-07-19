import React, { useContext, useReducer } from 'react';
import { MdAdd } from 'react-icons/md';
import UserContext from '../../context/UserContext';
import Wysiwyg from '../Wysiwyg';
import TextButtonGroup from '../TextButtonGroup';
import TextButton from '../TextButton';
import { createWysiwyg } from '../../actions/fieldNote';
import FieldNoteContext from '../../context/FieldNoteContext';

const FieldNote = (props) => {
  const { user } = useContext(UserContext);
  const [fieldNote, fieldNoteDispatch] = useContext(FieldNoteContext);

  const localStoreId = props.fieldNote
    ? `MOD-${props.fieldNote.uid}`
    : 'MOD-NEW-FIELD-NOTE';

  const handleCreateWysiwyg = () => {
    createWysiwyg(localStoreId, [], 0, fieldNoteDispatch); //How can I get the wysiwyg to display here???
  };

  const createVideo = () => {};
  const createPhoto = () => {};
  return (
    <div>
      Prepare to ponder
      <br />
      <TextButtonGroup>
        <TextButton onClick={handleCreateWysiwyg}>
          <MdAdd /> Add text
        </TextButton>
        <TextButton onClick={createVideo}>
          <MdAdd /> Add video
        </TextButton>
        <TextButton onClick={createPhoto}>
          <MdAdd /> Add photo
        </TextButton>
      </TextButtonGroup>
    </div>
  );
};

//Don't use modifications...write a new fieldNotes context
//What we want is for these buttons to be at the bottom
//When one button is clicked, that component is dropped in above the button
//The user should be able to reorder their text, image and photo blocks if they choose
//There will be a post button at the bottom of the screen
//Should contain buttons that allow a user to select a wysiwyg type
//When the appropriate button is selected, the editor appears
//Hovering over each button should tell the user what the icon corresponds to

export default FieldNote;
