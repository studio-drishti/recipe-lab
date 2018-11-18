import React from 'react';
import css from './Ingredient.css';
import { MdClear } from 'react-icons/md';

const getIngredientValue = (ingredient, fieldName) => {
  const { modification } = this.state;
  const mod = modification.alteredIngredients.find(
    mod => mod.ingredientId === ingredient._id && mod.field === fieldName
  );
  return mod ? mod.value : ingredient[fieldName];
};

const renderIngredientWithMods = ingredient => {
  const { modification } = this.state;
  const mods = {};
  modification.alteredIngredients
    .filter(mod => mod.ingredientId === ingredient._id)
    .forEach(mod => {
      mods[mod.field] = mod.value;
    });

  const formatted = [];
  const fields = ['quantity', 'unit', 'name', 'processing'];
  fields.forEach((fieldName, i) => {
    const separator =
      ingredient[fieldName] && 'processing' === fieldName ? ', ' : '';
    if (mods.hasOwnProperty(fieldName)) {
      formatted.push(<del key={'del' + i}>{ingredient[fieldName]}</del>);
      formatted.push(
        <ins key={'ins' + i}>
          {separator}
          {mods[fieldName]}
        </ins>
      );
    } else {
      formatted.push(
        <span key={i}>
          {separator}
          {ingredient[fieldName]}
        </span>
      );
    }
  });

  return formatted;
};

export default ({ ingredient }) => (
  <li className={css.ingredient}>
    {/* {editing ? (
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
      <span>{this.renderIngredientWithMods(ingredient)}</span>
    )} */}

    <span>
      {ingredient.quantity} {ingredient.unit} {ingredient.name}{' '}
      {ingredient.processing}
    </span>

    <button>
      <MdClear />
    </button>
  </li>
);
