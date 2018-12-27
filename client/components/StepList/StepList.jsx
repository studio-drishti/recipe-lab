import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';

import css from './StepList.css';

export default class StepList extends Component {
  static displayName = 'StepList';

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    itemId: PropTypes.string
  };

  render() {
    const { children, itemId } = this.props;
    return (
      <Droppable type={`STEP-${itemId}`} droppableId={itemId}>
        {(provided, snapshot) => (
          <ol
            className={classnames(css.steps, {
              [css.draggingOver]: snapshot.isDraggingOver
            })}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {children}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
    );
  }
}
