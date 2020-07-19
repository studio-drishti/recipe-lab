import React from 'react';
import { MdAdd } from 'react-icons/md';
import TextButton from '../../TextButton';

//This component should be a list of field notes with an add field note button
//A user that is not logged in cannot create a field note entry

const FieldNoteList = () => {
  const createFieldNote = () => {};
  return (
    <div>
      Prepare to ponder
      <br />
      <TextButton onClick={createFieldNote}>
        <MdAdd /> Add field note
      </TextButton>
      <br />
      List of field notes here
    </div>
  );
};

export default FieldNoteList;
