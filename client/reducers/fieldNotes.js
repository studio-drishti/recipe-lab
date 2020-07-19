import { MdPieChartOutlined } from 'react-icons/md';
import cuid from 'cuid';

//So this will need to have layers, each fieldnote entry should have an id
//This will be used as the parent for each type
//each type of editor should have an index in the field note entry
//We will need the following cases:
//CREATE-FIELDNOTE
//ADD-WYSIWYG
//ADD-PHOTO
//ADD-VIDEO
//REORDER?

export default (state, action) => {
  switch (action.type) {
    case 'CREATE-WYSIWYG': {
      const { userId, noteId } = action.payload;

      const addition = {
        uid: cuid(),
        kind: 'FieltNote',
        parentId: fieldNoteId,
        title: '',
      };

      return {
        ...state,
        sessionCount: state.sessionCount + 1,
      };
    }
  }
};
