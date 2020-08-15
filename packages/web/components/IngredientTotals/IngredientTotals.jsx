import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import RecipeContext from '../../context/RecipeContext';
import { addFractions } from '../../lib/math';

import css from './IngredientTotals.module.css';
import { MEASURE_UNITS } from '../../constants';

const IngredientTotals = ({ ingredients }) => {
  const {
    modification: { alterations, sessionCount },
  } = useContext(RecipeContext);

  const ingredientTotals = useMemo(() => {
    const totals = {};
    ingredients.forEach((originalIngredient) => {
      // Create a copy of the ingredient and apply any alterations.
      const ingredient = { ...originalIngredient };
      alterations
        .filter((mod) => mod.sourceId === originalIngredient.uid)
        .forEach((mod) => {
          ingredient[mod.field] = mod.value;
        });

      if (
        ingredient.name === '' ||
        ingredient.unit === '' ||
        ingredient.quantity === ''
      )
        return;

      if (ingredient.name in totals) {
        totals[ingredient.name].divided = true;
        if (ingredient.unit in totals[ingredient.name].quantities) {
          totals[ingredient.name].quantities[ingredient.unit] = addFractions(
            totals[ingredient.name].quantities[ingredient.unit],
            ingredient.quantity
          );
        } else {
          totals[ingredient.name].quantities = Object.assign(
            { [ingredient.unit]: ingredient.quantity },
            totals[ingredient.name].quantities
          );
        }
      } else {
        totals[ingredient.name] = {
          quantities: {
            [ingredient.unit]: ingredient.quantity,
          },
        };
      }
    });

    return Object.entries(totals).map(([key, val]) => ({
      name: key,
      divided: 'divided' in val,
      quantities: Object.entries(val.quantities)
        .map(([key, val]) => ({
          unit: key,
          quantity: val,
        }))
        .sort(
          (a, b) =>
            MEASURE_UNITS.indexOf(a.unit) > MEASURE_UNITS.indexOf(b.unit)
        ),
    }));
  }, [sessionCount]);

  const formatIngredientTotal = (ingredient) => {
    let text = ingredient.quantities
      .map((qty) => {
        return qty.unit !== 'undefined'
          ? `${qty.quantity} ${qty.unit}`
          : qty.quantity;
      })
      .join(' + ');
    text += ' ' + ingredient.name;
    if (ingredient.divided) text += ', divided';
    return text;
  };

  return ingredients.length ? (
    <ul className={css.ingredients}>
      {ingredientTotals.map((ingredient, i) => (
        <li key={i}>{formatIngredientTotal(ingredient)}</li>
      ))}
    </ul>
  ) : (
    <ul className={css.ingredients}>
      <li>xx x xx x x xx </li>
      <li>xx x x x xx </li>
    </ul>
  );
};

IngredientTotals.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object),
};

export default IngredientTotals;
