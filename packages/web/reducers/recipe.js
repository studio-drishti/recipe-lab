const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RECIPE_PHOTO': {
      const { photo } = action.payload;
      return { ...state, photo };
    }
    case 'SET_RECIPE': {
      return { ...state, ...action.payload };
    }
    default:
      throw new Error();
  }
};

export default recipeReducer;
