import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import {
  MdEdit,
  MdClear,
  MdCheck,
  MdRefresh,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdDoNotDisturb,
  MdAdd,
} from 'react-icons/md';
import classnames from 'classnames';
import Textarea from '../Textarea';
import RecipeContext from '../../context/RecipeContext';
import {
  removeStep,
  undoRemoval,
  setAlteration,
  createStep,
} from '../../actions/modification';
import {
  areAllFieldsEmpty,
  getFieldValue,
  renderFieldWithMods,
} from '../../utils/recipe';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';
import IconButton from '../IconButton';
import IconButtonGroup from '../IconButtonGroup';
import css from './Step.module.css';
import { createIngredient } from '../../actions/modification';

const Step = ({
  index,
  step,
  itemId,
  children,
  isLast,
  moveDraggable,
  steps,
}) => {
  const stepFields = ['directions'];
  const {
    modification: { alterations, removals, additions },
    modificationDispatch,
  } = useContext(RecipeContext);
  const isRemoved = useMemo(
    () => removals.some((sourceId) => [itemId, step.uid].includes(sourceId)),
    [removals]
  );
  const handleCreateIngredient = (e) => {
    e.stopPropagation();
    createIngredient(step.uid, modificationDispatch);
  };
  const [hovering, setHovering] = useState(false);
  const [edits, setEdits] = useState({});
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(
    areAllFieldsEmpty(stepFields, step, alterations)
  );

  const stepRef = useRef();
  const inputRef = useRef();
  const validationTimeouts = useRef({});

  const restoreStep = () =>
    undoRemoval([itemId, step.uid], modificationDispatch);

  const getStepValue = (fieldName) =>
    getFieldValue(fieldName, step, alterations, edits);

  const handleClick = (e) => {
    if (!stepRef.current) return;
    if (stepRef.current.contains(e.target)) return;
    setEditing(false);
  };

  const handleCreateStep = () => {
    if (!editing) {
      const unsortedSteps = [
        ...steps,
        ...additions.filter((step) => step.parentId === itemId),
      ];
      createStep(itemId, unsortedSteps, index, modificationDispatch);
    }
  };

  const discardChanges = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEdits({});
    setEditing(false);
  };

  const mouseEnter = () => {
    setHovering(true);
  };

  const mouseLeave = () => {
    setHovering(false);
  };

  const saveEdits = () => {
    Object.entries(edits)
      .filter(([key, value]) => validate(key, value))
      .forEach(([key, value]) => {
        setAlteration(step, key, value, modificationDispatch);
        delete edits[key];
        setEdits(edits);
      });
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveEdits();
    setEditing(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeStep(step, modificationDispatch);
  };

  const handleRestore = (e) => {
    e.stopPropagation();
    restoreStep();
  };

  const validate = (fieldName, value) => {
    let err = undefined;

    switch (fieldName) {
      case 'directions':
        if (value.length < 3 || value.length > 500)
          err = 'Directions must be between 3 and 500 characters';
        break;
    }

    setErrors((errors) => ({
      ...errors,
      [fieldName]: err,
    }));

    return Boolean(!err);
  };

  const handleStepChange = (e) => {
    const { name, value } = e.target;
    if (isRemoved) undoRemoval([itemId, step.uid], modificationDispatch);

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave(e);
      return;
    }
  };

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
      inputRef.current.selectionStart = getStepValue('directions').length;
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
      if (areAllFieldsEmpty(stepFields, step, alterations))
        removeStep(step, modificationDispatch);
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
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            className={classnames(css.step, {
              [css.hover]: hovering,
              [css.editing]: editing,
              [css.dragging]: snapshot.isDragging,
            })}
          >
            <div className={css.stepNum} {...provided.dragHandleProps}>
              <div>Step {index + 1}</div>
              <IconButtonGroup
                className={classnames(css.stepSort, css.buttons)}
              >
                {!editing && (
                  <>
                    <IconButton
                      disabled={snapshot.isDragging || isLast}
                      onClick={() => moveDraggable(step.uid, 'down')}
                    >
                      <MdKeyboardArrowDown />
                    </IconButton>
                    <IconButton
                      disabled={snapshot.isDragging || index === 0}
                      onClick={() => moveDraggable(step.uid, 'up')}
                    >
                      <MdKeyboardArrowUp />
                    </IconButton>
                  </>
                )}
              </IconButtonGroup>
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
                    error={errors.directions}
                    onKeyDown={handleKeyPress}
                  />
                )}

                {!editing && (
                  <p
                    className={classnames(css.stepDirections, {
                      [css.error]: errors.directions,
                    })}
                    onMouseDown={() => setEditing(true)}
                  >
                    {renderFieldWithMods(
                      'directions',
                      step,
                      alterations,
                      isRemoved,
                      edits,
                      errors
                    )}
                  </p>
                )}
                <TextButtonGroup className={css.buttons}>
                  {!editing && !isRemoved && (
                    <>
                      <TextButton
                        onClick={() => setEditing(true)}
                        disabled={snapshot.isDragging}
                      >
                        <MdEdit /> edit step
                      </TextButton>
                    </>
                  )}

                  {isRemoved && !editing && (
                    <TextButton
                      onClick={handleRestore}
                      disabled={snapshot.isDragging}
                    >
                      <MdRefresh /> restore step
                    </TextButton>
                  )}

                  {editing && (
                    <>
                      <TextButton
                        title="save changes"
                        type="submit"
                        onClick={handleSave}
                        disabled={snapshot.isDragging}
                      >
                        <MdCheck /> save
                      </TextButton>
                      <TextButton
                        title="discard changes"
                        onClick={discardChanges}
                        disabled={snapshot.isDragging}
                      >
                        <MdDoNotDisturb /> discard
                      </TextButton>
                    </>
                  )}
                </TextButtonGroup>
              </form>

              <TextButtonGroup
                className={classnames(css.buttons, css.stepActions)}
              >
                <TextButton
                  onClick={handleCreateStep}
                  disabled={editing || snapshot.isDragging}
                >
                  <MdAdd /> add step
                </TextButton>

                <TextButton
                  onClick={handleRemove}
                  disabled={editing || snapshot.isDragging}
                >
                  <MdClear /> remove step
                </TextButton>
              </TextButtonGroup>

              <div className={css.ingredients}>{children(setHovering)}</div>

              <TextButtonGroup
                className={classnames(css.buttons, css.ingredientActions)}
              >
                <TextButton
                  onClick={handleCreateIngredient}
                  disabled={editing || snapshot.isDragging}
                >
                  <MdAdd /> add ingredient
                </TextButton>
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
  children: PropTypes.func,
  isLast: PropTypes.bool,
  moveDraggable: PropTypes.func,
  steps: PropTypes.arrayOf(PropTypes.object),
};

export default Step;
