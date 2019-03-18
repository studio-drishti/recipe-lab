module.exports = {
  __resolveType(obj) {
    if (obj.unit) {
      return 'IngredientAddition';
    } else if (obj.directions) {
      return 'StepAddition';
    } else {
      return 'ItemAddition';
    }
  }
};
