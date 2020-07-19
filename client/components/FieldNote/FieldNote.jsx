import React from 'react';
import { MdAdd } from 'react-icons/md';
import Wysiwyg from '../Wysiwyg';
import TextButtonGroup from '../TextButtonGroup';
import TextButton from '../TextButton';

const FieldNote = (props) => {
  //const { user } = useContext(UserContext);
  // const [fieldNote, fieltNoteDispatch] = useReducer(
  //   fieltNoteReducer,
  //   props.fieltNote ? props.fieltNote : null
  // );

  const localStoreId = props.fieldNote
    ? `MOD-${props.fieldNote.uid}`
    : 'MOD-NEW-FIELD-NOTE';

  const createWysiwyg = () => {
    <Wysiwyg />; //This should something like createWysiwyg and then an instance of that component is created
  };

  const createVideo = () => {};
  const createPhoto = () => {};
  return (
    <div>
      Prepare to ponder
      <br />
      <TextButtonGroup>
        <TextButton onClick={createWysiwyg}>
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
