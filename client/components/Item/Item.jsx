import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdDoNotDisturb,
  MdEdit,
  MdClear,
  MdCheck,
  MdRefresh,
  MdAdd,
} from 'react-icons/md';
import classnames from 'classnames';
import RecipeContext from '../../context/RecipeContext';
import {
  setAlteration,
  removeItem,
  undoRemoval,
  createItem,
} from '../../actions/modification';
import { areAllFieldsEmpty, getFieldValue } from '../../lib/recipe';
import TextInput from '../TextInput';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';
import IconButton from '../IconButton';
import IconButtonGroup from '../IconButtonGroup';
import DiffText from '../DiffText';
import Tooltip from '../Tooltip';
import css from './Item.module.css';

const Item = ({ children, item, index, isLast, moveDraggable }) => {
  const itemFields = ['name'];

  const {
    recipe: { uid: recipeId, items },
    modification: { alterations, removals, additions },
    modificationDispatch,
  } = useContext(RecipeContext);

  const isRemoved = useMemo(() => removals.includes(item.uid), [removals]);

  const validationTimeouts = useRef({});
  const itemRef = useRef();
  const inputRef = useRef();

  const [hovering, setHovering] = useState(false);
  const [edits, setEdits] = useState({});
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(
    areAllFieldsEmpty(itemFields, item, alterations)
  );

  const getItemValue = (fieldName) =>
    getFieldValue(fieldName, item, alterations, edits);

  const handleSelect = (e) => {
    e.preventDefault();
    setEditing(true);
  };

  const saveEdits = () => {
    Object.entries(edits)
      .filter(([key, value]) => validate(key, value))
      .forEach(([key, value]) => {
        setAlteration(item, key, value, modificationDispatch);
        delete edits[key];
        setEdits(edits);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEdits();
    setEditing(false);
  };

  const handleClick = (e) => {
    if (itemRef.current.contains(e.target)) return;
    saveEdits();
    setEditing(false);
  };

  const mouseEnter = () => {
    setHovering(true);
  };

  const mouseLeave = () => {
    setHovering(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeItem(item, modificationDispatch);
  };

  const handleRestore = (e) => {
    e.stopPropagation();
    undoRemoval(item.uid, modificationDispatch);
  };

  const discardChanges = (e) => {
    e.preventDefault();
    setEdits({});
    setEditing(false);
  };

  const handleCreateItem = () => {
    if (editing) return;
    const unsortedItems = [
      ...items,
      ...additions.filter((item) => item.parentId === recipeId),
    ];
    createItem(recipeId, unsortedItems, index, modificationDispatch);
  };

  const renderNameWithMods = () => {
    const prefix = 'Directions for ';
    const original = prefix + item.name;
    const modified = prefix + getItemValue('name');

    if (isRemoved) return <del>{original}</del>;

    if (edits.name !== undefined && errors.name) {
      return (
        <Tooltip tip={errors.name}>
          <DiffText
            className={css.error}
            original={original}
            modified={modified}
          />
        </Tooltip>
      );
    }

    if (original !== modified) {
      return <DiffText original={original} modified={modified} />;
    }

    return original;
  };

  const validate = (fieldName, value) => {
    let err = undefined;

    switch (fieldName) {
      case 'name':
        if (value.length < 3 || value.length > 125)
          err = 'Item name must be between 3 and 125 characters';
        break;
    }

    setErrors((errors) => ({
      ...errors,
      [fieldName]: err,
    }));

    return Boolean(!err);
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    if (isRemoved) undoRemoval(item.uid, modificationDispatch);

    if (validationTimeouts.current[name])
      clearTimeout(validationTimeouts.current[name]);

    setEdits({
      ...edits,
      [name]: value,
    });

    validationTimeouts.current[name] = setTimeout(() => {
      validate(name, value);
      delete validationTimeouts.current[name];
    }, 1000);
  };

  useEffect(() => {
    if (editing) {
      document.addEventListener('mousedown', handleClick);
      inputRef.current.focus();
    } else {
      document.removeEventListener('mousedown', handleClick);
      if (areAllFieldsEmpty(itemFields, item, alterations, edits))
        removeItem(item, modificationDispatch);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [editing]);

  return (
    <Draggable type="ITEM" draggableId={item.uid} index={index}>
      {(provided, snapshot) => (
        <div
          className={css.itemWrap}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className={classnames(css.item, {
              [css.hover]: hovering,
              [css.editing]: editing,
              [css.dragging]: snapshot.isDragging,
            })}
          >
            <div
              onMouseOver={mouseEnter}
              onMouseLeave={mouseLeave}
              className={css.itemHeader}
              {...provided.dragHandleProps}
            >
              <form onSubmit={handleSubmit} ref={itemRef}>
                {editing && (
                  <TextInput
                    name="name"
                    className={css.nameInput}
                    value={getItemValue('name')}
                    inputRef={inputRef}
                    placeholder="Item name"
                    onChange={handleItemChange}
                    error={errors.name}
                  />
                )}

                {!editing && (
                  <h2 onMouseDown={handleSelect}>{renderNameWithMods()}</h2>
                )}

                <IconButtonGroup
                  className={classnames(css.itemActions, {
                    [css.dragging]: snapshot.isDragging,
                  })}
                >
                  {editing && (
                    <>
                      <IconButton title="save changes" type="submit">
                        <MdCheck />
                      </IconButton>
                      <IconButton
                        title="discard changes"
                        onClick={discardChanges}
                      >
                        <MdDoNotDisturb />
                      </IconButton>
                    </>
                  )}

                  {!editing && !isRemoved && (
                    <IconButton title="edit item" onClick={handleSelect}>
                      <MdEdit />
                    </IconButton>
                  )}

                  {!editing && isRemoved && (
                    <IconButton title="restore item" onClick={handleRestore}>
                      <MdRefresh />
                    </IconButton>
                  )}

                  {!editing && (
                    <>
                      <IconButton
                        disabled={snapshot.isDragging || isLast}
                        onClick={() => moveDraggable(item.uid, 'down')}
                      >
                        <MdKeyboardArrowDown />
                      </IconButton>
                      <IconButton
                        disabled={snapshot.isDragging || index === 0}
                        onClick={() => moveDraggable(item.uid, 'up')}
                      >
                        <MdKeyboardArrowUp />
                      </IconButton>
                    </>
                  )}
                </IconButtonGroup>
              </form>
            </div>
            {children}
          </div>
          <TextButtonGroup
            className={classnames(css.itemActions, {
              [css.dragging]: snapshot.isDragging,
            })}
          >
            <TextButton onClick={handleCreateItem} disabled={editing}>
              <MdAdd /> add item
            </TextButton>

            {!editing && !isRemoved && (
              <TextButton onClick={handleRemove}>
                <MdClear /> remove {getItemValue('name').toLowerCase()}
              </TextButton>
            )}

            {!editing && isRemoved && (
              <TextButton onClick={handleRestore}>
                <MdRefresh /> restore {getItemValue('name').toLowerCase()}
              </TextButton>
            )}
          </TextButtonGroup>
        </div>
      )}
    </Draggable>
  );
};

Item.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  item: PropTypes.object,
  isLast: PropTypes.bool,
  moveDraggable: PropTypes.func,
  steps: PropTypes.arrayOf(PropTypes.object),
};

Item.defaultProps = {
  isLast: false,
};

export default Item;
