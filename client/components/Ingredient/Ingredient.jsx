import React from 'react';
import css from './Ingredient.css';
import { MdClear, MdRefresh, MdCheck } from 'react-icons/md';

const ingredientFields = ['quantity', 'unit', 'name', 'processing'];

const getIngredientValue = (fieldName, ingredient, ingredientMods) => {
  if (ingredientMods.hasOwnProperty(fieldName))
    return ingredientMods[fieldName];

  return ingredient[fieldName];
};

const renderIngredientWithMods = (ingredient, ingredientMods) => {
  const formatted = [];

  ingredientFields.forEach((fieldName, i) => {
    if (
      'processing' === fieldName &&
      (ingredientMods.hasOwnProperty(fieldName) || ingredient[fieldName])
    ) {
      formatted.push(
        <span className={css.separator} key={'separator' + i}>
          ,
        </span>
      );
    }

    if (ingredientMods.hasOwnProperty(fieldName)) {
      if (ingredient[fieldName])
        formatted.push(<del key={'del' + i}>{ingredient[fieldName]}</del>);

      formatted.push(<ins key={'ins' + i}>{ingredientMods[fieldName]}</ins>);
    } else if (ingredient[fieldName]) {
      formatted.push(<span key={i}>{ingredient[fieldName]}</span>);
    }
  });
  return formatted;
};

const renderRemovedIngredient = ingredient => {
  const removedIngredient = [];

  ingredientFields.forEach(fieldName => {
    if (ingredient[fieldName])
      removedIngredient.push(
        'name' === fieldName && ingredient['processing']
          ? ingredient[fieldName] + ','
          : ingredient[fieldName]
      );
  });

  return <del>{removedIngredient.join(' ')}</del>;
};

export default ({
  ingredient,
  editing,
  removed,
  ingredientMods,
  removeAction,
  restoreAction,
  setEditingId
}) => (
  <li
    className={css.ingredient}
    data-editing={editing}
    onClick={() => setEditingId(ingredient._id)}
  >
    {editing ? (
      <fieldset>
        <input
          name="quantity"
          value={getIngredientValue('quantity', ingredient, ingredientMods)}
          placeholder={ingredient.quantity ? ingredient.quantity : 'Qty'}
        />
        <input
          name="unit"
          value={getIngredientValue('unit', ingredient, ingredientMods)}
          placeholder={ingredient.unit ? ingredient.unit : 'Unit'}
        />
        <input
          name="name"
          value={getIngredientValue('name', ingredient, ingredientMods)}
          placeholder={ingredient.name ? ingredient.name : 'Name'}
        />
        <input
          name="processing"
          value={getIngredientValue('processing', ingredient, ingredientMods)}
          placeholder={
            ingredient.processing ? ingredient.processing : 'Process'
          }
        />
      </fieldset>
    ) : (
      <div className={css.ingredientText}>
        {removed
          ? renderRemovedIngredient(ingredient)
          : renderIngredientWithMods(ingredient, ingredientMods)}
      </div>
    )}

    {removed &&
      !editing && (
        <button
          data-test-btn-state="restore"
          onClick={() => restoreAction(ingredient)}
        >
          <MdRefresh />
        </button>
      )}

    {!removed &&
      !editing && (
        <button
          data-test-btn-state="remove"
          onClick={() => removeAction(ingredient)}
        >
          <MdClear />
        </button>
      )}

    {editing && (
      <button datatest-btn-state="save">
        <MdCheck />
      </button>
    )}
  </li>
);
