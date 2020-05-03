import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { MdAdd } from 'react-icons/md';
import RecipeContext from '../../context/RecipeContext';
import { createStep } from '../../actions/modification';
import TextButton from '../TextButton';
import css from './StepList.module.css';

const StepList = ({ children, itemId }) => {
  const { modificationDispatch } = useContext(RecipeContext);

  const handleCreateStep = () => {
    createStep(itemId, [], 0, modificationDispatch);
  };

  return children.length > 0 ? (
    <Droppable type={`STEP-${itemId}`} droppableId={itemId}>
      {(provided, snapshot) => (
        <ol
          className={classnames(css.steps, {
            [css.draggingOver]: snapshot.isDraggingOver,
          })}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {children}
          {provided.placeholder}
        </ol>
      )}
    </Droppable>
  ) : (
    <div>
      Some placeholder stuff for steps... la la la... <br />{' '}
      <TextButton onClick={handleCreateStep}>
        <MdAdd /> add step
      </TextButton>
    </div>
  );
};

StepList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  itemId: PropTypes.string,
};

export default StepList;
