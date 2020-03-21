import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from 'react';
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
import { areAllFieldsEmpty, getFieldValue } from '../../utils/recipe';
import Tooltip from '../Tooltip';
import DiffText from '../DiffText';
import { MEASURE_UNITS } from '../../config';
import IconButton from '../IconButton';
import IconButtonGroup from '../IconButtonGroup';
import TextInput from '../TextInput';
import Select from '../Select';
import css from './Ingredient.module.css';

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
    areAllFieldsEmpty(ingredientFields, ingredient, alterations)
  );

  const restoreIngredient = () =>
    undoRemoval([itemId, stepId, ingredient.uid], modificationDispatch);

  const getIngredientValue = fieldName =>
    getFieldValue(fieldName, ingredient, alterations, edits);

  const renderRemovedIngredient = useCallback(() => {
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
  }, [isRemoved]);

  const renderIngredientWithMods = useCallback(() => {
    const originalQty = ingredient.quantity;
    const modifiedQty =
      !ingredient.quantity && !getIngredientValue('quantity')
        ? '??'
        : getIngredientValue('quantity');
    const originalUnit = ingredient.unit;
    const modifiedUnit = getIngredientValue('unit');
    let qtyAndUnit;
    if (originalQty !== modifiedQty && originalUnit !== modifiedUnit) {
      qtyAndUnit = (
        <>
          <del>
            {originalQty}
            {originalQty ? ' ' : ''}
            {originalUnit}
          </del>
          <ins>
            {modifiedQty}
            {modifiedQty ? ' ' : ''}
            {modifiedUnit}
          </ins>
        </>
      );
    } else if (originalQty !== modifiedQty || originalUnit !== modifiedUnit) {
      qtyAndUnit = (
        <>
          {originalQty !== modifiedQty ? (
            <>
              {originalQty && <del>{originalQty}</del>}
              {modifiedQty && <ins>{modifiedQty}</ins>}
            </>
          ) : (
            <span>{originalQty}</span>
          )}

          {originalUnit !== modifiedUnit ? (
            <>
              {originalQty && <del>{originalUnit}</del>}
              {modifiedQty && <ins>{modifiedUnit}</ins>}
            </>
          ) : (
            <span>{originalUnit}</span>
          )}
        </>
      );
    } else {
      qtyAndUnit = (
        <span>
          {originalQty}
          {originalUnit ? ' ' : ''}
          {originalUnit}
        </span>
      );
    }

    const original =
      ingredient.name +
      (ingredient.processing ? ', ' : '') +
      ingredient.processing;
    const modified =
      (!ingredient.name && !getIngredientValue('name')
        ? '???'
        : getIngredientValue('name')) +
      (getIngredientValue('processing') ? ', ' : '') +
      getIngredientValue('processing');

    return (
      <>
        {edits['quantity'] !== undefined && errors['quantity'] ? (
          <Tooltip className={css.error} tip={errors['quantity']}>
            {qtyAndUnit}
          </Tooltip>
        ) : (
          qtyAndUnit
        )}

        {edits['name'] !== undefined && errors['name'] ? (
          <Tooltip className={css.error} tip={errors['name']}>
            <DiffText original={original} modified={modified} />
          </Tooltip>
        ) : (
          <DiffText original={original} modified={modified} />
        )}
      </>
    );
  }, [editing, isRemoved]);

  const handleClick = e => {
    if (!ingredientRef.current) return;
    if (ingredientRef.current.contains(e.target)) return;
    saveEdits();
    setEditing(false);
  };

  const handleSave = e => {
    e.preventDefault();
    saveEdits();
    setEditing(false);
  };

  const handleSelect = e => {
    e.stopPropagation();
    setEditing(true);
  };

  const saveEdits = () => {
    Object.entries(edits)
      .filter(([key, value]) => validate(key, value))
      .forEach(([key, value]) => {
        setAlteration(ingredient, key, value, modificationDispatch);
        delete edits[key];
        setEdits(edits);
      });
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
      if (areAllFieldsEmpty(ingredientFields, ingredient, alterations, edits))
        removeIngredient(ingredient, modificationDispatch);
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
                  {isRemoved
                    ? renderRemovedIngredient()
                    : renderIngredientWithMods()}
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
