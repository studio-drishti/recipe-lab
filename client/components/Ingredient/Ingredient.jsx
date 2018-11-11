import React from 'react';
import css from './Ingredient.css';

export default ({ name, unit, processing, quantity }) => (
  <div>
    {quantity} {unit} {name}
  </div>
);
