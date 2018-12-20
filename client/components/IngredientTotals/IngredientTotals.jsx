import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import css from './IngredientTotals.css';
import { MEASURE_UNITS } from '../../config';

export default class IngredientTotals extends PureComponent {
  static displayName = 'IngredientTotals';
  static propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object)
  };

  getIngredientTotals = () => {
    const { steps } = this.props;
    const totals = {};

    steps.forEach(step =>
      step.ingredients.forEach(ingredient => {
        if (totals.hasOwnProperty(ingredient.name)) {
          totals[ingredient.name].divided = true;
          if (
            totals[ingredient.name].quantities.hasOwnProperty(ingredient.unit)
          ) {
            totals[ingredient.name].quantities[ingredient.unit] +=
              ingredient.quantity;
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
      })
    );

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
    const { steps } = this.props;
    return (
      <ul className={css.ingredients}>
        {this.getIngredientTotals(steps).map((ingredient, i) => (
          <li key={i}>{this.formatIngredientTotal(ingredient)}</li>
        ))}
      </ul>
    );
  }
}
