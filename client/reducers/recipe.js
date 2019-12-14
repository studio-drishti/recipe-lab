export default (state, action) => {
  switch (action.type) {
    case 'SET_RECIPE_PHOTO': {
      const { photo } = action.payload;
      return { ...state, photo };
    }
    default:
      throw new Error();
  }
};
