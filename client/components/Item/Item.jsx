import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import {
  MdDragHandle,
  MdEdit,
  MdClear,
  MdCheck,
  MdRefresh,
  MdAdd
} from 'react-icons/md';
import classnames from 'classnames';
import RecipeContext from '../../context/RecipeContext';
import {
  setAlteration,
  removeItem,
  undoRemoval,
  createItem,
  createStep
} from '../../actions/modification';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';
import DiffText from '../DiffText';

import css from './Item.css';

const Item = ({ children, item, index, isLast }) => {
  const itemFields = ['name'];
  const {
    recipe: { uid: recipeId },
    modification: { alterations, removals },
    modificationDispatch
  } = useContext(RecipeContext);
  const isRemoved = useMemo(() => removals.includes(item.uid), [removals]);
  const [hovering, setHovering] = useState(false);
  const [editing, setEditing] = useState(
    !itemFields.some(
      fieldName =>
        item[fieldName] ||
        alterations.some(
          mod => mod.sourceId === item.uid && mod.field === fieldName
        )
    )
  );
  const itemRef = useRef();
  const inputRef = useRef();

  const getItemValue = fieldName => {
    const mod = alterations.find(
      mod => mod.sourceId === item.uid && mod.field === fieldName
    );
    return mod !== undefined ? mod.value : item[fieldName];
  };

  const handleSelect = e => {
    e.preventDefault();
    setEditing(true);
  };

  const disableEditing = () => {
    if (!getItemValue('name')) {
      removeItem(item, modificationDispatch);
    } else {
      setEditing(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    disableEditing();
  };

  const handleClick = e => {
    if (itemRef.current.contains(e.target)) return;
    disableEditing();
  };

  const mouseEnter = () => {
    setHovering(true);
  };

  const mouseLeave = () => {
    setHovering(false);
  };

  const handleRemove = e => {
    e.stopPropagation();
    removeItem(item, modificationDispatch);
  };

  const handleRestore = e => {
    e.stopPropagation();
    undoRemoval(item, modificationDispatch);
  };

  const handleSave = e => {
    e.preventDefault();
    disableEditing();
    if (!getItemValue('name')) removeItem(item, modificationDispatch);
  };

  const handleCreateStep = () => {
    if (!editing) createStep(item.uid, modificationDispatch);
  };

  const handleCreateItem = () => {
    if (!editing) createItem(recipeId, modificationDispatch);
  };

  const renderNameWithMods = () => {
    const prefix = 'Directions for ';
    const original = prefix + item.name;

    if (isRemoved) return <del>{original}</del>;

    const modified = prefix + getItemValue('name');
    if (original !== modified) {
      return <DiffText original={original} modified={modified} />;
    }

    return original;
  };

  const handleItemChange = e => {
    const { name, value } = e.target;
    if (isRemoved) undoRemoval(item, modificationDispatch);
    setAlteration(item, name, value, modificationDispatch);
  };

  useEffect(() => {
    if (editing) {
      document.addEventListener('mousedown', handleClick);
      inputRef.current.focus();
    } else {
      document.removeEventListener('mousedown', handleClick);
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
              [css.dragging]: snapshot.isDragging
            })}
          >
            <div
              onMouseOver={mouseEnter}
              onMouseLeave={mouseLeave}
              className={css.itemHeaderWrap}
              ref={itemRef}
            >
              <div className={css.dragHandle} {...provided.dragHandleProps}>
                <MdDragHandle />
              </div>
              <div className={css.itemHeader}>
                <form className={css.itemName} onSubmit={handleSubmit}>
                  {editing && (
                    <input
                      type="text"
                      name="name"
                      value={getItemValue('name')}
                      ref={inputRef}
                      placeholder="Item name"
                      onChange={handleItemChange}
                    />
                  )}

                  {!editing && (
                    <h2 onMouseDown={handleSelect}>{renderNameWithMods()}</h2>
                  )}
                </form>
                <div className={css.itemActions}>
                  {editing && (
                    <button title="Save modifications" onClick={handleSave}>
                      <MdCheck />
                    </button>
                  )}

                  {!editing && isRemoved && (
                    <button title="Restore item" onClick={handleRestore}>
                      <MdRefresh />
                    </button>
                  )}

                  {!editing && !isRemoved && (
                    <>
                      <button title="Edit item name" onClick={handleSelect}>
                        <MdEdit />
                      </button>
                      <button title="Remove item" onClick={handleRemove}>
                        <MdClear />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {children}
          </div>
          <TextButtonGroup
            className={classnames(css.itemActions, {
              [css.dragging]: snapshot.isDragging
            })}
          >
            <TextButton onClick={handleCreateStep} disabled={editing}>
              <MdAdd /> add step
            </TextButton>

            {isLast && (
              <TextButton onClick={handleCreateItem} disabled={editing}>
                <MdAdd /> add item
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
  handleItemChange: PropTypes.func,
  isLast: PropTypes.bool
};

Item.defaultProps = {
  isLast: false
};

export default Item;
