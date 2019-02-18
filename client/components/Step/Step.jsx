import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdEdit, MdClear, MdCheck, MdRefresh } from 'react-icons/md';
import classnames from 'classnames';

import css from './Step.css';

export default class Step extends PureComponent {
  static displayName = 'Step';

  static propTypes = {
    index: PropTypes.number,
    itemId: PropTypes.string,
    stepId: PropTypes.string,
    isActive: PropTypes.bool,
    directions: PropTypes.node,
    directionsValue: PropTypes.string,
    activateStep: PropTypes.func,
    removed: PropTypes.bool,
    focusOnMount: PropTypes.bool,
    removeStep: PropTypes.func,
    restoreStep: PropTypes.func
  };

  static defaultProps = {
    isActive: false,
    removed: false,
    focusOnMount: false
  };

  state = {
    editing: false
  };

  stepRef = React.createRef();
  inputRef = React.createRef();

  componentDidMount() {
    if (this.props.focusOnMount) this.enableEditing();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isActive && !this.props.isActive && this.state.editing) {
      this.disableEditing();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  enableEditing = async () => {
    const { activateStep, isActive } = this.props;
    if (!isActive) activateStep();
    await this.setState({ editing: true });
    if (this.inputRef.current) this.inputRef.current.focus();
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
    const { activateStep, isActive } = this.props;
    if (isActive && !this.state.editing) {
      this.enableEditing();
    } else if (!isActive) {
      activateStep();
    }
  };

  handleSave = e => {
    e.stopPropagation();

    const { directionsValue, removeStep } = this.props;
    if (!directionsValue) {
      removeStep();
    }
    this.disableEditing();
  };

  handleRemove = e => {
    e.stopPropagation();
    this.props.removeStep();
  };

  handleRestore = e => {
    e.stopPropagation();
    this.props.restoreStep();
  };

  render() {
    const {
      index,
      itemId,
      stepId,
      isActive,
      removed,
      restoreStep,
      directions
    } = this.props;
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
                {directions &&
                  React.cloneElement(directions, {
                    editing,
                    removed,
                    restoreStep,
                    inputRef: this.inputRef
                  })}
              </div>

              <div className={css.stepActions}>
                {removed && !editing && (
                  <button
                    type="button"
                    title="restore step"
                    onClick={this.handleRestore}
                  >
                    <MdRefresh />
                  </button>
                )}

                {!removed && !editing && (
                  <>
                    <button title="Edit step" onClick={this.enableEditing}>
                      <MdEdit />
                    </button>
                    <button title="Remove step" onClick={this.handleRemove}>
                      <MdClear />
                    </button>
                  </>
                )}

                {editing && (
                  <button title="Save modifications" onClick={this.handleSave}>
                    <MdCheck />
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
