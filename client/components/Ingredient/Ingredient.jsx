import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import css from './Ingredient.css';
import DiffMatchPatch from 'diff-match-patch';
import { MdClear, MdRefresh, MdCheck } from 'react-icons/md';

const ingredientFields = ['quantity', 'unit', 'name', 'processing'];

export default class Ingredient extends Component {
  getIngredientValue = fieldName => {
    const { ingredient, ingredientMods } = this.props;

    if (ingredientMods.hasOwnProperty(fieldName))
      return ingredientMods[fieldName];

    return ingredient[fieldName];
  };

  renderRemovedIngredient = () => {
    const { ingredient } = this.props;
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

  renderIngredientWithMods = () => {
    const { ingredient, ingredientMods } = this.props;

    const original = ingredientFields
      .reduce((result, fieldName) => {
        const separator =
          fieldName === 'name' && ingredient['processing'] ? ',' : '';

        if (ingredient[fieldName])
          result.push(ingredient[fieldName] + separator);

        return result;
      }, [])
      .join(' ');

    if (!ingredientMods) return <span>{original}</span>;

    const modified = ingredientFields
      .reduce((result, fieldName) => {
        const separator =
          fieldName === 'name' &&
          ((ingredientMods.hasOwnProperty('processing') &&
            ingredientMods['processing']) ||
            ingredient['processing'])
            ? ','
            : '';
        if (ingredientMods.hasOwnProperty(fieldName)) {
          result.push(ingredientMods[fieldName] + separator);
        } else if (ingredient[fieldName]) {
          result.push(ingredient[fieldName] + separator);
        }
        return result;
      }, [])
      .join(' ');

    const dmp = new DiffMatchPatch();
    const diff = dmp.diff_main(original, modified);
    dmp.diff_cleanupSemantic(diff);

    return diff.map((match, i) => {
      const text = match[1].trim();
      const comma = text.startsWith(',');
      switch (match[0]) {
        case 1:
          return (
            <ins className={comma ? css.comma : undefined} key={i}>
              {text}
            </ins>
          );
        case -1:
          return (
            <del className={comma ? css.comma : undefined} key={i}>
              {text}
            </del>
          );
        default:
          return (
            <span className={comma ? css.comma : undefined} key={i}>
              {text}
            </span>
          );
      }
    });
  };

  handleSave = e => {
    e.stopPropagation();
    // TODO: actually save the changes??
    this.props.setEditingId(null);
  };

  handleSelect = e => {
    e.stopPropagation();
    this.props.setEditingId(this.props.ingredient._id);
  };

  handleRemove = e => {
    e.stopPropagation();
    this.props.removeAction(this.props.ingredient);
  };

  handleRestore = e => {
    e.stopPropagation();
    this.props.restoreAction(this.props.ingredient);
  };

  render() {
    const { ingredient, editing, removed, handleIngredientChange } = this.props;

    return (
      <li
        className={css.ingredient}
        data-editing={editing}
        onClick={this.handleSelect}
      >
        {editing ? (
          <fieldset>
            <input
              name="quantity"
              value={this.getIngredientValue('quantity')}
              placeholder={ingredient.quantity ? ingredient.quantity : 'Qty'}
              onChange={handleIngredientChange}
            />
            <input
              name="unit"
              value={this.getIngredientValue('unit')}
              placeholder={ingredient.unit ? ingredient.unit : 'Unit'}
              onChange={handleIngredientChange}
            />
            <input
              name="name"
              value={this.getIngredientValue('name')}
              placeholder={ingredient.name ? ingredient.name : 'Name'}
              onChange={handleIngredientChange}
            />
            <input
              name="processing"
              value={this.getIngredientValue('processing')}
              placeholder={
                ingredient.processing ? ingredient.processing : 'Process'
              }
              onChange={handleIngredientChange}
            />
          </fieldset>
        ) : (
          <div className={css.ingredientText}>
            {removed
              ? this.renderRemovedIngredient()
              : this.renderIngredientWithMods()}
          </div>
        )}

        {removed && !editing && (
          <button aria-label="restore ingredient" onClick={this.handleRestore}>
            <MdRefresh />
          </button>
        )}

        {!removed && !editing && (
          <button aria-label="remove ingredient" onClick={this.handleRemove}>
            <MdClear />
          </button>
        )}

        {editing && (
          <button aria-label="save modifications" onClick={this.handleSave}>
            <MdCheck />
          </button>
        )}
      </li>
    );
  }
}

Ingredient.propTypes = {
  ingredient: PropTypes.object.isRequired,
  ingredientMods: PropTypes.object,
  editing: PropTypes.bool,
  removed: PropTypes.bool,
  removeAction: PropTypes.func,
  restoreAction: PropTypes.func,
  handleIngredientChange: PropTypes.func,
  setEditingId: PropTypes.func
};

Ingredient.displayName = 'Ingredient';
