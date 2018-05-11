export const stepsToIngredientTotals = steps => {
  if( ! Array.isArray(steps) ) return false;

  const totals = {};

  steps.forEach( step => step.ingredients.forEach( ingredient => {
    if(totals.hasOwnProperty(ingredient.name)) {
      totals[ingredient.name].divided = true;
      if(totals[ingredient.name].quantities.hasOwnProperty(ingredient.unit)) {
        totals[ingredient.name].quantities[ingredient.unit] += ingredient.quantity
      } else {
        totals[ingredient.name].quantities = Object.assign(
          { [ingredient.unit]: ingredient.quantity },
          totals[ingredient.name].quantities
        )
      }
    } else {
      totals[ingredient.name] = {
        quantities: {
          [ingredient.unit]: ingredient.quantity,
        }
      }
    }
  }));

  return Object.entries(totals).map(([key, val]) => ({
    name: key,
    divided: val.hasOwnProperty('divided'),
    quantities: Object.entries(val.quantities).map(([key, val]) => ({
      unit: key,
      quantity: val,
    })),
  }))
}

export const sortIngredientQuantites = quantities => {
  const units = ['cup', 'tbsp', 'tsp'];
  return quantities.sort((a, b) => units.indexOf(a.unit) > units.indexOf(b.unit))
}

export const formatIngredientTotal = ingredient => {
  const quantities = sortIngredientQuantites(ingredient.quantities);
  let text = quantities.map( qty => [`${qty.quantity} ${qty.unit}`]).join(', ')
  text += ' ' + ingredient.name
  if(ingredient.divided) text += ', divided'
  return text
}
