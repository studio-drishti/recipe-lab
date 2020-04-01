export const setRecipePhoto = (photo, dispatch) =>
  dispatch({
    type: 'SET_RECIPE_PHOTO',
    payload: { photo }
  });

export const setRecipe = (recipe, dispatch) =>
  dispatch({ type: 'SET_RECIPE', payload: recipe });
