import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClear, MdRefresh, MdCheck } from 'react-icons/md';
import classnames from 'classnames';
import math from 'mathjs';

import css from './Ingredient.css';
import DiffText from '../DiffText';
import { MEASURE_UNITS } from '../../config';
import IconButton from '../IconButton';

export default class Ingredient extends Component {
  static displayName = 'Ingredient';

  static propTypes = {
    ingredient: PropTypes.object.isRequired,
    ingredientMods: PropTypes.arrayOf(PropTypes.object),
    editing: PropTypes.bool,
    removed: PropTypes.bool,
    removeIngredient: PropTypes.func,
    restoreIngredient: PropTypes.func,
    saveOrUpdateField: PropTypes.func,
    setActiveIngredient: PropTypes.func
  };

  static defaultProps = {
    ingredientMods: [],
    editing: false,
    removed: false
  };

  state = {
    errors: {},
    edits: {}
  };

  ingredientFields = ['quantity', 'unit', 'name', 'processing'];

  ingredientRef = React.createRef();
  quantityInputRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
      this.quantityInputRef.current.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  getIngredientValue = fieldName => {
    const { edits } = this.state;
    if (edits[fieldName] !== undefined) return edits[fieldName];

    const { ingredient, ingredientMods } = this.props;
    const mod = ingredientMods.find(
      mod => mod.sourceId === ingredient.uid && mod.field === fieldName
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
    this.props.setActiveIngredient(null);
    document.removeEventListener('mousedown', this.handleClick);
    this.setState({ errors: {}, edits: {} });
  };

  handleClick = e => {
    if (this.ingredientRef.current.contains(e.target)) return;
    this.deselect();
  };

  handleSave = e => {
    e.preventDefault();
    if (
      !this.getIngredientValue('quantity') &&
      !this.getIngredientValue('unit') &&
      !this.getIngredientValue('name') &&
      !this.getIngredientValue('processing')
    ) {
      this.props.removeIngredient();
    }
    this.deselect();
    this.ingredientRef.current.focus();
  };

  handleSelect = e => {
    e.stopPropagation();
    document.addEventListener('mousedown', this.handleClick);
    this.props.setActiveIngredient(this.props.ingredient);
  };

  handleKeybdSelect = e => {
    if (e.key !== 'Enter') return;
    this.handleSelect(e);
  };

  handleRemove = e => {
    e.stopPropagation();
    this.props.removeIngredient();
  };

  handleKeybdRemove = e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    this.handleRemove(e);
    this.ingredientRef.current.focus();
  };

  handleRestore = e => {
    e.stopPropagation();
    this.props.restoreIngredient();
  };

  handleKeybdRestore = e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    this.handleRestore(e);
    this.ingredientRef.current.focus();
  };

  handleIngredientChange = e => {
    let { name, value } = e.target;
    const { errors, edits } = this.state;
    const {
      removed,
      ingredient,
      saveOrUpdateField,
      restoreIngredient
    } = this.props;

    errors[name] = null;
    edits[name] = value;

    switch (name) {
      case 'quantity':
        try {
          if (value) math.fraction(value);
        } catch {
          errors.quantity =
            'Please enter quantity as whole numbers and fractions (e.g. 1 1/3)';
        }
        break;
    }

    this.setState({ edits, errors });

    if (
      !errors.quantity &&
      !errors.unit &&
      !errors.name &&
      !errors.processing
    ) {
      if (removed) restoreIngredient();
      saveOrUpdateField(ingredient, name, value);
    }
  };

  render() {
    const { editing, removed } = this.props;
    const { errors } = this.state;
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
          {editing && (
            <fieldset>
              <input
                type="text"
                name="quantity"
                title="Quantity"
                ref={this.quantityInputRef}
                value={this.getIngredientValue('quantity')}
                placeholder={'Qty'}
                onChange={this.handleIngredientChange}
                className={classnames({ [css.error]: errors.quantity })}
              />
              <select
                type="text"
                name="unit"
                title="Unit"
                value={this.getIngredientValue('unit')}
                onChange={this.handleIngredientChange}
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
                onChange={this.handleIngredientChange}
              />
              <input
                type="text"
                name="processing"
                title="Process"
                value={this.getIngredientValue('processing')}
                placeholder={'Process'}
                onChange={this.handleIngredientChange}
              />
            </fieldset>
          )}

          {!editing && removed && this.renderRemovedIngredient()}

          {!editing && !removed && this.renderIngredientWithMods()}

          <div className={css.buttons}>
            {removed && !editing && (
              <IconButton
                className={css.button}
                aria-label="restore ingredient"
                onClick={this.handleRestore}
                onKeyDown={this.handleKeybdRestore}
              >
                <MdRefresh />
              </IconButton>
            )}

            {!removed && !editing && (
              <IconButton
                className={css.button}
                aria-label="remove ingredient"
                onClick={this.handleRemove}
                onKeyDown={this.handleKeybdRemove}
              >
                <MdClear />
              </IconButton>
            )}

            {editing && (
              <IconButton
                className={css.button}
                type="submit"
                aria-label="save modifications"
              >
                <MdCheck />
              </IconButton>
            )}
          </div>
        </form>
      </li>
    );
  }
}
