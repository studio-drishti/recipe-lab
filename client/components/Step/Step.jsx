import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdEdit, MdClear, MdCheck, MdRefresh, MdAdd } from 'react-icons/md';
import classnames from 'classnames';

import css from './Step.css';
import IconButton from '../IconButton';
import IconButtonGroup from '../IconButtonGroup';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';

export default class Step extends PureComponent {
  static displayName = 'Step';

  static propTypes = {
    index: PropTypes.number,
    itemId: PropTypes.string,
    stepId: PropTypes.string,
    directions: PropTypes.node,
    directionsValue: PropTypes.string,
    activateStep: PropTypes.func,
    removed: PropTypes.bool,
    focusOnMount: PropTypes.bool,
    removeStep: PropTypes.func,
    restoreStep: PropTypes.func,
    children: PropTypes.func
  };

  static defaultProps = {
    removed: false,
    focusOnMount: false
  };

  state = {
    isActive: false,
    editing: false
  };

  stepRef = React.createRef();
  inputRef = React.createRef();

  componentDidMount() {
    if (this.props.focusOnMount) this.enableEditing();
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.isActive && !this.props.isActive && this.state.editing) {
  //     this.disableEditing();
  //   }
  // }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  activateStep = () => {
    this.setState({ isActive: true });
    document.addEventListener('mousedown', this.handleClick);
  };

  deactivateStep = () => {
    this.setState({ isActive: false, editing: false });
    document.removeEventListener('mousedown', this.handleClick);
  };

  enableEditing = async () => {
    const { directionsValue } = this.props;
    await this.setState({ editing: true, isActive: true });
    this.inputRef.current.focus();
    this.inputRef.current.selectionStart = directionsValue.length;
    document.addEventListener('mousedown', this.handleClick);
  };

  disableEditing = () => {
    this.setState({ editing: false });
    // document.removeEventListener('mousedown', this.handleClick);
  };

  handleClick = e => {
    if (!this.stepRef.current.contains(e.target)) {
      this.deactivateStep();
    } else if (e.target !== this.inputRef.current) {
      this.disableEditing();
    }
  };

  handleSelect = () => {
    const { isActive, editing } = this.state;
    if (isActive && !editing) {
      this.enableEditing();
    } else if (!isActive) {
      this.activateStep();
    }
  };

  handleSave = e => {
    e.stopPropagation();
    this.disableEditing();
    if (!this.props.directionsValue) this.props.removeStep();
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
    const { index, itemId, stepId, removed, children } = this.props;
    const { editing, isActive } = this.state;
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
                {/* {directions &&
                  React.cloneElement(directions, {
                    editing,
                    removed,
                    restoreStep,
                    inputRef: this.inputRef
                  })} */}
                {children({ editing, isActive, inputRef: this.inputRef })}

                <div className={css.stepActions}>
                  <TextButtonGroup>
                    {editing && (
                      <TextButton onClick={this.handleSave}>
                        <MdCheck /> save directions
                      </TextButton>
                    )}

                    {!editing && !removed && (
                      <TextButton onClick={this.enableEditing}>
                        <MdEdit /> edit directions
                      </TextButton>
                    )}

                    {!removed && (
                      <TextButton>
                        <MdAdd /> add ingredient
                      </TextButton>
                    )}

                    {!removed && (
                      <TextButton onClick={this.handleRemove}>
                        <MdClear /> remove step
                      </TextButton>
                    )}

                    {removed && !editing && (
                      <TextButton onClick={this.handleRestore}>
                        <MdRefresh /> restore step
                      </TextButton>
                    )}
                  </TextButtonGroup>
                </div>
              </div>

              <div className={css.stepShortcuts}>
                <IconButtonGroup>
                  {removed && !editing && (
                    <IconButton
                      className={css.button}
                      title="restore step"
                      onClick={this.handleRestore}
                    >
                      <MdRefresh />
                    </IconButton>
                  )}

                  {!removed && !editing && (
                    <>
                      <IconButton
                        title="Edit step"
                        className={css.button}
                        onClick={this.enableEditing}
                      >
                        <MdEdit />
                      </IconButton>
                      <IconButton
                        title="Remove step"
                        className={css.button}
                        onClick={this.handleRemove}
                      >
                        <MdClear />
                      </IconButton>
                    </>
                  )}
                </IconButtonGroup>
              </div>
            </div>
          </li>
        )}
      </Draggable>
    );
  }
}
