import React from 'react';
import css from './Ingredient.css';
import { MdClear, MdRefresh, MdCheck } from 'react-icons/md';

const ingredientFields = ['quantity', 'unit', 'name', 'processing'];

// const getIngredientValue = (ingredient, fieldName) => {
//   const { modification } = this.state;
//   const mod = modification.alteredIngredients.find(
//     mod => mod.ingredientId === ingredient._id && mod.field === fieldName
//   );
//   return mod ? mod.value : ingredient[fieldName];
// };

const renderIngredientWithMods = (ingredient, modifications) => {
  const formatted = [];

  ingredientFields.forEach((fieldName, i) => {
    if (
      'processing' === fieldName &&
      (modifications.hasOwnProperty(fieldName) || ingredient[fieldName])
    ) {
      formatted.push(
        <span className={css.separator} key={'separator' + i}>
          ,
        </span>
      );
    }

    if (modifications.hasOwnProperty(fieldName)) {
      if (ingredient[fieldName])
        formatted.push(<del key={'del' + i}>{ingredient[fieldName]}</del>);

      formatted.push(<ins key={'ins' + i}>{modifications[fieldName]}</ins>);
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
  modifications,
  removeAction,
  restoreAction
}) => (
  <li className={css.ingredient}>
    {editing ? (
      <fieldset>
        <input
          name="quantity"
          value={this.getIngredientValue(ingredient, 'quantity')}
          placeholder={ingredient.quantity ? ingredient.quantity : 'Qty'}
          onChange={this.handleIngredientChange.bind(this, i)}
        />
        <input
          name="unit"
          value={this.getIngredientValue(ingredient, 'unit')}
          placeholder={ingredient.unit ? ingredient.unit : 'Unit'}
          onChange={this.handleIngredientChange.bind(this, i)}
        />
        <input
          name="name"
          value={this.getIngredientValue(ingredient, 'name')}
          placeholder={ingredient.name ? ingredient.name : 'Name'}
          onChange={this.handleIngredientChange.bind(this, i)}
        />
        <input
          name="processing"
          value={this.getIngredientValue(ingredient, 'processing')}
          placeholder={
            ingredient.processing ? ingredient.processing : 'Process'
          }
          onChange={this.handleIngredientChange.bind(this, i)}
        />
      </fieldset>
    ) : (
      <div className={css.ingredientText}>
        {removed
          ? renderRemovedIngredient(ingredient)
          : renderIngredientWithMods(ingredient, modifications)}
      </div>
    )}

    {removed && !editing ? (
      <button
        data-test-btn-state="restore"
        onClick={() => restoreAction(ingredient)}
      >
        <MdRefresh />
      </button>
    ) : (
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
