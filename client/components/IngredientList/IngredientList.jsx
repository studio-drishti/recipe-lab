import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import { MdAdd } from 'react-icons/md';

import TextButton from '../TextButton';
import { createIngredient } from '../../actions/modification';

import css from './IngredientList.module.css';
import RecipeContext from '../../context/RecipeContext';

const IngredientList = ({ stepId, children }) => {
  const { modificationDispatch } = useContext(RecipeContext);
  const handleCreateIngredient = e => {
    e.stopPropagation();
    createIngredient(stepId, modificationDispatch);
  };

  return (
    <>
      {children.length > 0 && (
        <Droppable type="INGREDIENT" droppableId={stepId}>
          {(provided, snapshot) => (
            <ul
              className={classnames(css.ingredients, {
                [css.draggingOver]: snapshot.isDraggingOver
              })}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {children}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      )}
      {
        <div className={classnames(css.listActions)}>
          <TextButton onClick={handleCreateIngredient}>
            <MdAdd /> add ingredient
          </TextButton>
        </div>
      }
    </>
  );
};

IngredientList.propTypes = {
  stepId: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default IngredientList;
