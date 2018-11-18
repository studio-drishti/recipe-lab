import React from 'react';
import css from './IngredientList.css';
import Ingredient from '../Ingredient';

export default ({ ingredients }) => (
  <ul className={css.ingredients}>
    {ingredients.map((ingredient, i) => (
      <Ingredient ingredient={ingredient} key={i} />
    ))}
  </ul>
);
