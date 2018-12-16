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

const getEditingState = (editingId, ingredients) => {
  return (
    ingredients.find(ingredient => ingredient._id === editingId) !== undefined
  );
};

export default ({
  ingredients,
  modification,
  removeAction,
  restoreAction,
  setEditingId,
  editingId
}) => (
  <ul
    className={css.ingredients}
    data-editing={getEditingState(editingId, ingredients)}
  >
    {ingredients.map((ingredient, i) => (
      <Ingredient
        key={i}
        ingredient={ingredient}
        ingredientMods={getIngredientMods(ingredient, modification)}
        removed={getRemovedState(ingredient, modification)}
        editing={editingId === ingredient._id}
        removeAction={removeAction}
        restoreAction={restoreAction}
        setEditingId={setEditingId}
      />
    ))}
  </ul>
);
