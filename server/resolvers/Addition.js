module.exports = {
  __resolveType(obj) {
    if ('unit' in obj) {
      return 'IngredientAddition';
    } else if ('directions' in obj) {
      return 'StepAddition';
    } else {
      return 'ItemAddition';
    }
  },
};
