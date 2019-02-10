import React, { Component } from 'react';
import PropTypes from 'prop-types';

import css from './IngredientTotals.css';
import { MEASURE_UNITS } from '../../config';

export default class IngredientTotals extends Component {
  static displayName = 'IngredientTotals';

  static propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object),
    removals: PropTypes.arrayOf(PropTypes.string),
    alterations: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    removals: [],
    alterations: []
  };

  getIngredientWithMods = ingredient => {
    const { alterations } = this.props;
    const newIngredient = { ...ingredient };
    alterations
      .filter(mod => mod.sourceId === ingredient._id)
      .forEach(mod => {
        newIngredient[mod.field] = mod.value;
      });
    return newIngredient;
  };

  getIngredientTotals = () => {
    const { steps, removals } = this.props;
    const totals = {};
    steps
      .filter(step => !removals.includes(step._id))
      .forEach(step =>
        step.ingredients
          .filter(ingredient => !removals.includes(ingredient._id))
          .forEach(unModifiedIngredient => {
            const ingredient = this.getIngredientWithMods(unModifiedIngredient);
            if (totals.hasOwnProperty(ingredient.name)) {
              totals[ingredient.name].divided = true;
              if (
                totals[ingredient.name].quantities.hasOwnProperty(
                  ingredient.unit
                )
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
