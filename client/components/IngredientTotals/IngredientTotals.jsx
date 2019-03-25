import React, { Component } from 'react';
import PropTypes from 'prop-types';

import addFractions from '../../utils/addFractions';

import css from './IngredientTotals.css';
import { MEASURE_UNITS } from '../../config';

export default class IngredientTotals extends Component {
  static displayName = 'IngredientTotals';

  static propTypes = {
    ingredients: PropTypes.arrayOf(PropTypes.object),
    alterations: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    alterations: []
  };

  getIngredientWithMods = ingredient => {
    const { alterations } = this.props;
    const newIngredient = { ...ingredient };
    alterations
      .filter(mod => mod.sourceId === ingredient.uid)
      .forEach(mod => {
        newIngredient[mod.field] = mod.value;
      });
    return newIngredient;
  };

  getIngredientTotals = () => {
    const { ingredients } = this.props;
    const totals = {};
    ingredients.forEach(unModifiedIngredient => {
      const ingredient = this.getIngredientWithMods(unModifiedIngredient);
      if (totals.hasOwnProperty(ingredient.name)) {
        totals[ingredient.name].divided = true;
        if (
          totals[ingredient.name].quantities.hasOwnProperty(ingredient.unit)
        ) {
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
            [ingredient.unit]: ingredient.quantity
          }
        };
      }
    });

    return Object.entries(totals).map(([key, val]) => ({
      name: key,
      divided: val.hasOwnProperty('divided'),
      quantities: Object.entries(val.quantities)
        .map(([key, val]) => ({
          unit: key,
          quantity: val
        }))
        .sort(
          (a, b) =>
            MEASURE_UNITS.indexOf(a.unit) > MEASURE_UNITS.indexOf(b.unit)
        )
    }));
  };

  formatIngredientTotal = ingredient => {
    let text = ingredient.quantities
      .map(qty => {
        return qty.unit !== 'undefined'
          ? `${qty.quantity} ${qty.unit}`
          : qty.quantity;
      })
      .join(' + ');
    text += ' ' + ingredient.name;
    if (ingredient.divided) text += ', divided';
    return text;
  };

  render() {
    return (
      <ul className={css.ingredients}>
        {this.getIngredientTotals().map((ingredient, i) => (
          <li key={i}>{this.formatIngredientTotal(ingredient)}</li>
        ))}
      </ul>
    );
  }
}
