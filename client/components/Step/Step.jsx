import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdEdit, MdClear, MdCheck, MdRefresh } from 'react-icons/md';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';
import RecipeContext from '../../context/RecipeContext';
import {
  removeStep,
  undoRemoval,
  setAlteration
} from '../../actions/modification';
import DiffText from '../DiffText';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';

import css from './Step.css';

const Step = ({ index, itemId, step, children }) => {
  const stepFields = ['directions'];
  const {
    modification: { alterations, removals },
    modificationDispatch
  } = useContext(RecipeContext);
  const isRemoved = useMemo(
    () => removals.some(sourceId => [itemId, step.uid].includes(sourceId)),
    [removals]
  );
  const [isActive, setActive] = useState(false);
  const [editing, setEditing] = useState(
    !stepFields.some(
      fieldName =>
        step[fieldName] ||
        alterations.some(
          mod => mod.sourceId === step.uid && mod.field === fieldName
        )
    )
  );

  const stepRef = useRef();
  const inputRef = useRef();

  const restoreStep = () =>
    undoRemoval([itemId, step.uid], modificationDispatch);

  const getStepValue = fieldName => {
    const mod = alterations.find(
      mod => mod.sourceId === step.uid && mod.field === fieldName
    );
    return mod !== undefined ? mod.value : step[fieldName];
  };

  const activateStep = () => {
    setActive(true);
  };

  const deactivateStep = () => {
    if (!getStepValue('directions')) {
      removeStep(step, modificationDispatch);
    } else {
      setEditing(false);
      setActive(false);
    }
  };

  const enableEditing = () => {
    setActive(true);
    setEditing(true);
  };

  const disableEditing = () => {
    if (!getStepValue('directions')) {
      removeStep(step, modificationDispatch);
    } else {
      setEditing(true);
    }
  };

  const handleClick = e => {
    if (!stepRef.current.contains(e.target)) {
      deactivateStep();
    } else if (e.target !== inputRef.current) {
      disableEditing();
    }
  };

  const handleSelect = e => {
    e.preventDefault();
    if (isActive && !editing) {
      enableEditing();
    } else if (!isActive) {
      activateStep();
    }
  };

  const handleSave = e => {
    e.stopPropagation();
    disableEditing();
  };

  const handleRemove = e => {
    e.stopPropagation();
    removeStep(step, modificationDispatch);
  };

  const handleRestore = e => {
    e.stopPropagation();
    restoreStep();
  };

  const renderDirectionsWithMods = () => {
    const original = step.directions;
    if (isRemoved) return <del>{original}</del>;
    const modified = getStepValue('directions');
    if (original !== modified) {
      return <DiffText original={original} modified={modified} />;
    }
    return original;
  };

  const handleStepChange = e => {
    const { name, value } = e.target;
    if (isRemoved) restoreStep();
    setAlteration(step, name, value, modificationDispatch);
  };

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
      inputRef.current.selectionStart = getStepValue('directions').length;
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [editing]);

  return (
    <Draggable type={`STEP-${itemId}`} draggableId={step.uid} index={index}>
      {(provided, snapshot) => (
        <li
          className={css.container}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            ref={stepRef}
            className={classnames(css.step, {
              [css.active]: isActive,
              [css.editing]: editing,
              [css.dragging]: snapshot.isDragging
            })}
          >
            <div className={css.stepNum} {...provided.dragHandleProps}>
              Step {index + 1}
            </div>

            <div className={css.stepContents}>
              <form className={css.directions}>
                {editing && (
                  <Textarea
                    inputRef={inputRef}
                    name="directions"
                    value={getStepValue('directions')}
                    placeholder="Directions"
                    onChange={handleStepChange}
                  />
                )}

                {!editing && (
                  <p className={css.stepDirections} onMouseDown={handleSelect}>
                    {renderDirectionsWithMods()}
                  </p>
                )}
              </form>

              <div>{children}</div>
            </div>
            <div className={css.stepActions}>
              <TextButtonGroup>
                {editing && (
                  <TextButton onClick={handleSave}>
                    <MdCheck /> save directions
                  </TextButton>
                )}

                {!editing && !isRemoved && (
                  <TextButton title="edit directions" onClick={enableEditing}>
                    <MdEdit /> edit directions
                  </TextButton>
                )}

                {!isRemoved && (
                  <TextButton onClick={handleRemove}>
                    <MdClear /> remove step
                  </TextButton>
                )}

                {isRemoved && !editing && (
                  <TextButton onClick={handleRestore}>
                    <MdRefresh /> restore step
                  </TextButton>
                )}
              </TextButtonGroup>
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};

Step.propTypes = {
  index: PropTypes.number,
  itemId: PropTypes.string,
  step: PropTypes.object,
  children: PropTypes.func
};

export default Step;
