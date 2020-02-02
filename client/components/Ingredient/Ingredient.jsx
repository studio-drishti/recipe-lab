import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  MdClear,
  MdEdit,
  MdRefresh,
  MdCheck,
  MdDragHandle
} from 'react-icons/md';
import classnames from 'classnames';
import { fraction } from 'mathjs';
import { Draggable } from 'react-beautiful-dnd';
import RecipeContext from '../../context/RecipeContext';
import {
  undoRemoval,
  setAlteration,
  removeIngredient
} from '../../actions/modification';
import DiffText from '../DiffText';
import { MEASURE_UNITS } from '../../config';
import IconButton from '../IconButton';
import IconButtonGroup from '../IconButtonGroup';
import TextInput from '../TextInput';
import Select from '../Select';
import css from './Ingredient.css';

const Ingredient = ({ index, ingredient, itemId, stepId }) => {
  const ingredientFields = ['quantity', 'unit', 'name', 'processing'];
  const {
    modification: { removals, alterations },
    modificationDispatch
  } = useContext(RecipeContext);
  const isRemoved = useMemo(
    () =>
      removals.some(sourceId =>
        [itemId, stepId, ingredient.uid].includes(sourceId)
      ),
    [removals]
  );
  const ingredientRef = useRef();
  const quantityInputRef = useRef();
  const validationTimeouts = useRef({});
  const [errors, setErrors] = useState({});
  const [edits, setEdits] = useState({});
  const [editing, setEditing] = useState(
    !ingredientFields.some(
      fieldName =>
        ingredient[fieldName] ||
        alterations.some(
          mod => mod.sourceId === ingredient.uid && mod.field === fieldName
        )
    )
  );

  const restoreIngredient = () =>
    undoRemoval([itemId, stepId, ingredient.uid], modificationDispatch);

  const getIngredientValue = fieldName => {
    if (edits[fieldName] !== undefined) return edits[fieldName];

    const mod = alterations.find(
      mod => mod.sourceId === ingredient.uid && mod.field === fieldName
    );

    return mod !== undefined ? mod.value : ingredient[fieldName];
  };

  const renderRemovedIngredient = () => {
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

  const renderIngredientWithMods = () => {
    //render function will output 3 things
    //quantity, unit, name and processing,
    //if there is an errror, that will be handled on the individual object
    //if there has been a change, the original and modified value needs to be displayed for unit and quantity
    //There will only be a diff text around name and processing.
    //Quantity and unit will just display the original with the modification next to it

    //If quantity or unit have a modification, the original and modification will both show
    //The original will be crossed out

    //If name and processing have modifications, we will use difftext to render the text

    //Error...
    //If an existing ingredient is modified and a field is moved to an error state, the user will be able to save that modification
    //In this case, a tool tip with information about what the error is will appear

    //In the case of a newly added ingredient...how to handles errors is less clear.
    //We want to allow the user to save, but how do we indicate that the ingredient is in an error state

    const original = ingredientFields
      .reduce((result, fieldName) => {
        let value = ingredient[fieldName];
        if (value) {
          value += fieldName === 'name' && ingredient['processing'] ? ',' : '';
          result.push(value);
        }
        return result;
      }, [])
      .join(' ');

    if (
      alterations.filter(alteration => alteration.sourceId === ingredient.uid)
        .length === 0
    )
      return <span>{original}</span>;

    const modified = ingredientFields
      .reduce((result, fieldName) => {
        let value = getIngredientValue(fieldName);
        if (value) {
          value +=
            fieldName === 'name' && getIngredientValue('processing') ? ',' : '';
          result.push(value);
        }
        return result;
      }, [])
      .join(' ');

    return <DiffText original={original} modified={modified} />;
  };

  const handleClick = e => {
    if (!ingredientRef.current) return;
    if (ingredientRef.current.contains(e.target)) return;
    deselect();
  };

  const handleSave = e => {
    e.preventDefault();
    deselect();
  };

  const handleSelect = e => {
    e.stopPropagation();
    setEditing(true);
  };

  const isIngredientEmpty = () => {
    return !ingredientFields.some(
      fieldName =>
        edits[fieldName] ||
        ingredient[fieldName] ||
        alterations.some(
          mod => mod.sourceId === ingredient.uid && mod.field === fieldName
        )
    );
  };

  const deselect = () => {
    if (isIngredientEmpty()) {
      removeIngredient(ingredient, modificationDispatch);
    } else {
      Object.entries(edits)
        .filter(([key]) => validate(key, getIngredientValue(key)))
        .forEach(([key, value]) => {
          setAlteration(ingredient, key, value, modificationDispatch);
          delete edits[key];
          setEdits(edits);
        });
      setEditing(false);
    }
  };

  const handleKeybdSelect = e => {
    if (e.key !== 'Enter') return;
    handleSelect(e);
  };

  const handleRemove = e => {
    e.stopPropagation();
    removeIngredient(ingredient, modificationDispatch);
  };

  const handleKeybdRemove = e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    handleRemove(e);
  };

  const handleRestore = e => {
    e.stopPropagation();
    restoreIngredient();
  };

  const handleKeybdRestore = e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    handleRestore(e);
    ingredientRef.current.focus();
  };

  const handleIngredientChange = e => {
    let { name, value } = e.target;

    if (isRemoved) restoreIngredient();

    if (validationTimeouts.current[name])
      clearTimeout(validationTimeouts.current[name]);

    setEdits({
      ...edits,
      [name]: value
    });

    validationTimeouts.current[name] = setTimeout(() => {
      validate(name, value);
      delete validationTimeouts.current[name];
    }, 1000);
  };

  const validate = (fieldName, value) => {
    let err = undefined;

    switch (fieldName) {
      case 'quantity':
        try {
          if (!value) throw new Error();
          fraction(value);
        } catch {
          err =
            'Please enter quantity as whole numbers and fractions (e.g. 1 1/3)';
        }
        break;
      case 'name':
        if (value.length < 3 || value.length > 125)
          err = 'Ingredient name must be between 3 and 125 characters';
        break;
    }

    setErrors(errors => ({
      ...errors,
      [fieldName]: err
    }));

    return Boolean(!err);
  };

  useEffect(() => {
    if (editing) {
      document.addEventListener('mousedown', handleClick);
      quantityInputRef.current.focus();
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [editing]);

  return (
    <Draggable type="INGREDIENT" draggableId={ingredient.uid} index={index}>
      {(provided, snapshot) => (
        <li
          className={css.container}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className={classnames(css.ingredient, {
              [css.dragging]: snapshot.isDragging,
              [css.editing]: editing
            })}
            onKeyPress={handleKeybdSelect}
            tabIndex="0"
          >
            <div className={css.dragHandle} {...provided.dragHandleProps}>
              <MdDragHandle />
            </div>
            <form onSubmit={handleSave} ref={ingredientRef}>
              {editing && (
                <fieldset>
                  <TextInput
                    name="quantity"
                    title="Quantity"
                    inputRef={quantityInputRef}
                    value={getIngredientValue('quantity')}
                    placeholder={'Qty'}
                    onChange={handleIngredientChange}
                    error={errors.quantity}
                  />
                  <Select
                    name="unit"
                    title="Unit"
                    value={getIngredientValue('unit')}
                    onChange={handleIngredientChange}
                  >
                    <option value="">--</option>
                    {MEASURE_UNITS.map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </Select>
                  <TextInput
                    name="name"
                    title="Name"
                    value={getIngredientValue('name')}
                    placeholder={'Name'}
                    onChange={handleIngredientChange}
                    error={errors.name}
                  />
                  <TextInput
                    name="processing"
                    title="Process"
                    value={getIngredientValue('processing')}
                    placeholder={'Process'}
                    onChange={handleIngredientChange}
                  />
                </fieldset>
              )}

              {!editing && (
                <div className={css.ingredientText} onMouseDown={handleSelect}>
                  {isRemoved && renderRemovedIngredient()}
                  {!isRemoved && renderIngredientWithMods()}
                </div>
              )}

              <IconButtonGroup className={css.buttons}>
                {isRemoved && !editing && (
                  <IconButton
                    className={css.button}
                    aria-label="restore ingredient"
                    onClick={handleRestore}
                    onKeyDown={handleKeybdRestore}
                  >
                    <MdRefresh />
                  </IconButton>
                )}

                {!isRemoved && !editing && (
                  <>
                    <IconButton
                      className={css.button}
                      aria-label="edit ingredient"
                      onMouseDown={handleSelect}
                      onKeyDown={handleKeybdSelect}
                    >
                      <MdEdit />
                    </IconButton>
                    <IconButton
                      className={css.button}
                      aria-label="remove ingredient"
                      onClick={handleRemove}
                      onKeyDown={handleKeybdRemove}
                    >
                      <MdClear />
                    </IconButton>
                  </>
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
              </IconButtonGroup>
            </form>
          </div>
        </li>
      )}
    </Draggable>
  );
};

Ingredient.propTypes = {
  index: PropTypes.number,
  ingredient: PropTypes.object.isRequired,
  itemId: PropTypes.string,
  stepId: PropTypes.string
};

export default Ingredient;
