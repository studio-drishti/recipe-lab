import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './IngredientList.css';
import Ingredient from '../Ingredient';

export default class IngredientList extends Component {
  static displayName = 'IngredientList';

  static propTypes = {
    ingredients: PropTypes.array,
    modification: PropTypes.object,
    removeAction: PropTypes.func,
    restoreAction: PropTypes.func,
    handleIngredientChange: PropTypes.func,
    setEditingId: PropTypes.func,
    editingId: PropTypes.string
  };

  getIngredientMods = ingredient => {
    const { modification } = this.props;
    const mods = {};
    modification.alteredIngredients
      .filter(mod => mod.ingredientId === ingredient._id)
      .forEach(mod => {
        mods[mod.field] = mod.value;
      });
    return mods;
  };

  isRemoved = ingredient => {
    const { modification } = this.props;
    return modification.removedIngredients.includes(ingredient._id);
  };

  isEditing = () => {
    const { ingredients, editingId } = this.props;
    return ingredients.some(ingredient => ingredient._id === editingId);
  };

  render() {
    const {
      ingredients,
      removeAction,
      restoreAction,
      handleIngredientChange,
      setEditingId,
      editingId
    } = this.props;
    return (
      <ul className={css.ingredients} data-editing={this.isEditing()}>
        {ingredients.map((ingredient, i) => (
          <Ingredient
            key={i}
            ingredient={ingredient}
            ingredientMods={this.getIngredientMods(ingredient)}
            removed={this.isRemoved(ingredient)}
            editing={editingId === ingredient._id}
            removeAction={removeAction}
            restoreAction={restoreAction}
            handleIngredientChange={handleIngredientChange}
            setEditingId={setEditingId}
          />
        ))}
      </ul>
    );
  }
}
