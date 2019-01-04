import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdEdit, MdClear, MdCheck } from 'react-icons/md';
import classnames from 'classnames';

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

  static defaultProps = {
    isActive: false
  };

  state = {
    editing: false
  };

  stepRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (prevProps.isActive && !this.props.isActive && this.state.editing) {
      this.disableEditing();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  enableEditing = () => {
    const { setActiveStep, isActive } = this.props;
    if (!isActive) setActiveStep();
    this.setState({ editing: true });
    document.addEventListener('mousedown', this.handleClick);
  };

  disableEditing = () => {
    this.setState({ editing: false });
    document.removeEventListener('mousedown', this.handleClick);
  };

  handleClick = e => {
    if (this.stepRef.current.contains(e.target)) return;
    this.disableEditing();
  };

  handleSelect = () => {
    const { setActiveStep, isActive } = this.props;
    if (isActive && !this.state.editing) {
      this.enableEditing();
    } else if (!isActive) {
      setActiveStep();
    }
  };

  render() {
    const { index, itemId, stepId, isActive, children: child } = this.props;
    const { editing } = this.state;
    return (
      <Draggable type={`STEP-${itemId}`} draggableId={stepId} index={index}>
        {(provided, snapshot) => (
          <li
            className={css.container}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              ref={this.stepRef}
              className={classnames(css.step, {
                [css.active]: isActive,
                [css.editing]: editing,
                [css.dragging]: snapshot.isDragging
              })}
            >
              <div className={css.stepNum} {...provided.dragHandleProps}>
                <span>{index + 1}.</span>
              </div>

              <div className={css.stepDirections} onClick={this.handleSelect}>
                {child && React.cloneElement(child, { editing })}
              </div>

              <div className={css.stepActions}>
                <button title="Remove step">
                  <MdClear />
                </button>
                {editing ? (
                  <button
                    title="Save modifications"
                    onClick={this.disableEditing}
                  >
                    <MdCheck />
                  </button>
                ) : (
                  <button title="Edit directions" onClick={this.enableEditing}>
                    <MdEdit />
                  </button>
                )}
              </div>
            </div>
          </li>
        )}
      </Draggable>
    );
  }
}
