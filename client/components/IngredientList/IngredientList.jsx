import React from 'react';
import PropTypes from 'prop-types';
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

const IngredientList = ({
  ingredients,
  modification,
  removeAction,
  restoreAction,
  handleIngredientChange,
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
        handleIngredientChange={handleIngredientChange}
        setEditingId={setEditingId}
      />
    ))}
  </ul>
);

IngredientList.propTypes = {
  ingredients: PropTypes.array,
  modification: PropTypes.object,
  removeAction: PropTypes.func,
  restoreAction: PropTypes.func,
  handleIngredientChange: PropTypes.func,
  setEditingId: PropTypes.func,
  editingId: PropTypes.string
};

IngredientList.displayName = 'IngredientList';
export default IngredientList;
