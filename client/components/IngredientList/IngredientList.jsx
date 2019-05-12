import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdAdd } from 'react-icons/md';
import classnames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';

import css from './IngredientList.css';
import TextButton from '../TextButton';

export default class IngredientList extends Component {
  static displayName = 'IngredientList';

  static propTypes = {
    stepId: PropTypes.string,
    editing: PropTypes.bool,
    createIngredient: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  handleCreate = () => {
    const { editing, createIngredient } = this.props;
    if (!editing) createIngredient();
  };

  render() {
    const { editing, children, stepId } = this.props;
    return (
      <>
        {children.length > 0 && (
          <Droppable type="INGREDIENT" droppableId={stepId}>
            {(provided, snapshot) => (
              <ul
                className={classnames(css.ingredients, {
                  [css.editing]: editing,
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
        {/* <div
          className={classnames(css.listActions, { [css.editing]: editing })}
        >
          <TextButton onClick={this.handleCreate}>
            <MdAdd /> add ingredient
          </TextButton>
        </div> */}
      </>
    );
  }
}
