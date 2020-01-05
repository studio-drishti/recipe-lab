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
  const [hovering, setHovering] = useState(false);
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

  const handleClick = e => {
    if (!stepRef.current) return;
    if (stepRef.current.contains(e.target)) return;
    setEditing(false);
  };

  const mouseEnter = () => {
    setHovering(true);
  };

  const mouseLeave = () => {
    setHovering(false);
  };

  const handleSave = e => {
    e.stopPropagation();
    setEditing(false);
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
      if (!getStepValue('directions')) removeStep(step, modificationDispatch);
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
            className={classnames(css.step, {
              [css.hover]: hovering,
              [css.editing]: editing,
              [css.dragging]: snapshot.isDragging
            })}
          >
            <div
              onMouseOver={mouseEnter}
              onMouseLeave={mouseLeave}
              className={css.stepNum}
              {...provided.dragHandleProps}
            >
              Step {index + 1}
            </div>

            <div className={css.stepContents}>
              <form className={css.directions} ref={stepRef}>
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
                  <p
                    className={css.stepDirections}
                    onMouseDown={() => setEditing(true)}
                  >
                    {renderDirectionsWithMods()}
                  </p>
                )}

                <div className={css.stepActions}>
                  <TextButtonGroup className={css.buttons}>
                    {editing && (
                      <TextButton onClick={handleSave}>
                        <MdCheck /> save directions
                      </TextButton>
                    )}

                    {!editing && !isRemoved && (
                      <TextButton
                        title="edit directions"
                        onClick={() => setEditing(true)}
                      >
                        <MdEdit /> edit directions
                      </TextButton>
                    )}

                    {!isRemoved && !editing && (
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
              </form>

              <div>{children}</div>
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
  children: PropTypes.node
};

export default Step;
