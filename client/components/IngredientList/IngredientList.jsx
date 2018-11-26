import React from 'react';
import css from './IngredientList.css';
import Ingredient from '../Ingredient';

const getIngredientMods = (ingredient, modifications) => {
  const mods = {};
  modifications.alteredIngredients
    .filter(mod => mod.ingredientId === ingredient._id)
    .forEach(mod => {
      mods[mod.field] = mod.value;
    });
  return mods;
};

const getRemovedState = (ingredient, modifications) => {
  return modifications.removedIngredients.includes(ingredient._id);
};

export default ({
  ingredients,
  modifications,
  removeAction,
  restoreAction
}) => (
  <ul className={css.ingredients}>
    {ingredients.map((ingredient, i) => (
      <Ingredient
        key={i}
        ingredient={ingredient}
        modifications={getIngredientMods(ingredient, modifications)}
        removed={getRemovedState(ingredient, modifications)}
        editing={false}
        removeAction={removeAction}
        restoreAction={restoreAction}
      />
    ))}
  </ul>
);
