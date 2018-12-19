import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

import css from './Step.css';

export default class Step extends PureComponent {
  static displayName = 'Step';

  static propTypes = {
    index: PropTypes.number,
    itemId: PropTypes.string,
    stepId: PropTypes.string,
    isActive: PropTypes.bool,
    content: PropTypes.string,
    clickHandler: PropTypes.func
  };

  render() {
    const {
      index,
      itemId,
      stepId,
      isActive,
      content,
      clickHandler
    } = this.props;
    return (
      <Draggable type={`STEP-${itemId}`} draggableId={stepId} index={index}>
        {provided => (
          <li
            className={css.step}
            data-active={isActive}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div className={css.stepNum} {...provided.dragHandleProps}>
              <span>{index + 1}.</span>
            </div>
            <div className={css.stepDirections} onClick={clickHandler}>
              {content}
            </div>
          </li>
        )}
      </Draggable>
    );
  }
}
