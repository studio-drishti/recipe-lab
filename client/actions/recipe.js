export const setRecipePhoto = (photo, dispatch) =>
  dispatch({
    type: 'SET_RECIPE_PHOTO',
    payload: { photo }
  });
