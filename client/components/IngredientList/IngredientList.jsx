import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';

import css from './IngredientList.css';

export default class IngredientList extends Component {
  static displayName = 'IngredientList';

  static propTypes = {
    stepId: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  render() {
    const { children, stepId } = this.props;
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
      </>
    );
  }
}
