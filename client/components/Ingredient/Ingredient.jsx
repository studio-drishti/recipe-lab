import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClear, MdRefresh, MdCheck } from 'react-icons/md';

import css from './Ingredient.css';
import DiffText from '../DiffText';
import { MEASURE_UNITS } from '../../config';

export default class Ingredient extends Component {
  static displayName = 'Ingredient';

  static propTypes = {
    ingredient: PropTypes.object.isRequired,
    ingredientMods: PropTypes.arrayOf(PropTypes.object),
    editing: PropTypes.bool,
    removed: PropTypes.bool,
    removeAction: PropTypes.func,
    restoreAction: PropTypes.func,
    handleIngredientChange: PropTypes.func,
    setEditingId: PropTypes.func
  };

  static defaultProps = {
    ingredientMods: [],
    editing: false,
    removed: false
  };

  ingredientFields = ['quantity', 'unit', 'name', 'processing'];

  ingredientRef = React.createRef();
  quantityInputRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
      this.quantityInputRef.current.focus();
    }
  }

  getIngredientValue = fieldName => {
    const { ingredient, ingredientMods } = this.props;

    const mod = ingredientMods.find(
      mod => mod.ingredientId === ingredient._id && mod.field === fieldName
    );

    return mod !== undefined ? mod.value : ingredient[fieldName];
  };

  renderRemovedIngredient = () => {
    const { ingredient } = this.props;
    const removedIngredient = [];

    this.ingredientFields.forEach(fieldName => {
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

    const original = this.ingredientFields
      .reduce((result, fieldName) => {
        let value = ingredient[fieldName];
        if (value) {
          value += fieldName === 'name' && ingredient['processing'] ? ',' : '';
          result.push(value);
        }
        return result;
      }, [])
      .join(' ');

    if (ingredientMods.length === 0) return <span>{original}</span>;

    const modified = this.ingredientFields
      .reduce((result, fieldName) => {
        let value = this.getIngredientValue(fieldName);
        if (value) {
          value +=
            fieldName === 'name' && this.getIngredientValue('processing')
              ? ','
              : '';
          result.push(value);
        }
        return result;
      }, [])
      .join(' ');

    return <DiffText original={original} modified={modified} />;
  };

  deselect = () => {
    this.props.setEditingId(null);
    document.removeEventListener('mousedown', this.handleClick);
  };

  handleClick = e => {
    if (this.ingredientRef.current.contains(e.target)) return;
    this.deselect();
  };

  handleSave = e => {
    e.preventDefault();
    this.deselect();
    if (e.key === 'Enter') this.ingredientRef.current.focus();
  };

  handleSelect = e => {
    e.stopPropagation();
    document.addEventListener('mousedown', this.handleClick);
    this.props.setEditingId(this.props.ingredient._id);
  };

  handleKeybdSelect = e => {
    if (e.key !== 'Enter') return;
    this.handleSelect(e);
  };

  handleRemove = e => {
    e.stopPropagation();
    this.props.removeAction(this.props.ingredient);
  };

  handleKeybdRemove = e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    this.handleRemove(e);
    this.ingredientRef.current.focus();
  };

  handleRestore = e => {
    e.stopPropagation();
    this.props.restoreAction(this.props.ingredient);
  };

  handleKeybdRestore = e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    this.handleRestore(e);
    this.ingredientRef.current.focus();
  };

  render() {
    const { editing, removed, handleIngredientChange } = this.props;

    return (
      <li
        className={css.ingredient}
        data-editing={editing}
        onClick={this.handleSelect}
        onKeyPress={this.handleKeybdSelect}
        ref={this.ingredientRef}
        tabIndex="0"
      >
        <form onSubmit={this.handleSave}>
          {editing ? (
            <fieldset>
              <input
                type="text"
                name="quantity"
                title="Quantity"
                ref={this.quantityInputRef}
                value={this.getIngredientValue('quantity')}
                placeholder={'Qty'}
                onChange={handleIngredientChange}
              />
              <select
                type="text"
                name="unit"
                title="Unit"
                value={this.getIngredientValue('unit')}
                onChange={handleIngredientChange}
              >
                <option value="">--</option>
                {MEASURE_UNITS.map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="name"
                title="Name"
                value={this.getIngredientValue('name')}
                placeholder={'Name'}
                onChange={handleIngredientChange}
              />
              <input
                type="text"
                name="processing"
                title="Process"
                value={this.getIngredientValue('processing')}
                placeholder={'Process'}
                onChange={handleIngredientChange}
              />
            </fieldset>
          ) : (
            <div>
              {removed
                ? this.renderRemovedIngredient()
                : this.renderIngredientWithMods()}
            </div>
          )}

          <div className={css.buttons}>
            {removed && !editing && (
              <button
                type="button"
                aria-label="restore ingredient"
                onClick={this.handleRestore}
                onKeyDown={this.handleKeybdRestore}
              >
                <MdRefresh />
              </button>
            )}

            {!removed && !editing && (
              <button
                type="button"
                aria-label="remove ingredient"
                onClick={this.handleRemove}
                onKeyDown={this.handleKeybdRemove}
              >
                <MdClear />
              </button>
            )}

            {editing && (
              <button type="submit" aria-label="save modifications">
                <MdCheck />
              </button>
            )}
          </div>
        </form>
      </li>
    );
  }
}
