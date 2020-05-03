import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { MdAdd } from 'react-icons/md';
import RecipeContext from '../../context/RecipeContext';
import { createItem } from '../../actions/modification';
import TextButton from '../TextButton';
import css from './ItemList.module.css';

const ItemList = ({ children }) => {
  const {
    recipe: { uid: recipeId },
    modificationDispatch,
  } = useContext(RecipeContext);

  const handleCreateItem = () => {
    createItem(recipeId, [], 0, modificationDispatch);
  };

  return children.length > 0 ? (
    <Droppable type="ITEM" droppableId={recipeId}>
      {(provided, snapshot) => (
        <div
          className={classnames(css.items, {
            [css.draggingOver]: snapshot.isDraggingOver,
          })}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ) : (
    <div>
      Some placeholder stuff here. la la la la la....
      <br />
      <TextButton onClick={handleCreateItem}>
        <MdAdd /> add item
      </TextButton>
    </div>
  );
};

ItemList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default ItemList;
