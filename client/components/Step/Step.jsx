import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdEdit, MdClear } from 'react-icons/md';

import css from './Step.css';

export default class Step extends PureComponent {
  static displayName = 'Step';

  static propTypes = {
    index: PropTypes.number,
    itemId: PropTypes.string,
    stepId: PropTypes.string,
    isActive: PropTypes.bool,
    children: PropTypes.node,
    setActiveStep: PropTypes.func
  };

  editDirections = () => {
    const { setActiveStep } = this.props;
    setActiveStep();
  };

  render() {
    const {
      index,
      itemId,
      stepId,
      isActive,
      children,
      setActiveStep
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
            <div className={css.stepDirections} onClick={setActiveStep}>
              {children}
            </div>
            <div className={css.stepActions}>
              <button title="Remove step">
                <MdClear />
              </button>
              <button title="Edit directions" onClick={this.editDirections}>
                <MdEdit />
              </button>
            </div>
          </li>
        )}
      </Draggable>
    );
  }
}
