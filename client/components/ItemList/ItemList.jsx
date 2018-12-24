import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

import css from './ItemList.css';

export default class ItemList extends Component {
  static displayName = 'ItemList';

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    recipeId: PropTypes.string
  };

  render() {
    const { children, recipeId } = this.props;
    return (
      <Droppable type="ITEM" droppableId={recipeId}>
        {provided => (
          <div
            className={css.steps}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}
