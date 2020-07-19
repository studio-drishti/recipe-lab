export const createWysiwyg = (fieldNoteID, items, index, dispatch) =>
  dispatch({
    type: 'CREATE_WYSIWYG',
    payload: { fieldNoteID, items, index },
  });
