import React from 'react';
import Link from 'next/link';

//This component should be a list of field notes with an add field note button
//A user that is not logged in cannot create a field note entry
//Field note list only appears when a user is not editing or creating a field note

const FieldNotes = () => {
  return (
    <div>
      Prepare to ponder
      <br />
      <Link href="/new-field-note">
        <a> + Add field note </a>
      </Link>
      <br />
      List of field notes here
    </div>
  );
};

export default FieldNotes;
