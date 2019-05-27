import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdEdit, MdClear, MdCheck, MdRefresh, MdAdd } from 'react-icons/md';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';

import DiffText from '../DiffText';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';

import css from './Step.css';

export default class Step extends PureComponent {
  static displayName = 'Step';

  static propTypes = {
    index: PropTypes.number,
    itemId: PropTypes.string,
    step: PropTypes.object,
    stepMods: PropTypes.arrayOf(PropTypes.object),
    removed: PropTypes.bool,
    saveOrUpdateField: PropTypes.func,
    removeStep: PropTypes.func,
    restoreStep: PropTypes.func,
    createIngredient: PropTypes.func,
    children: PropTypes.func
  };

  static defaultProps = {
    removed: false,
    stepMods: []
  };

  state = {
    isActive: false,
    editing: false
  };

  stepRef = React.createRef();
  inputRef = React.createRef();

  componentDidMount() {
    if (this.getStepValue('directions') === '') this.enableEditing();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, true);
  }

  activateStep = () => {
    this.setState({ isActive: true });
    document.addEventListener('mousedown', this.handleClick, true);
  };

  deactivateStep = () => {
    this.setState({ isActive: false, editing: false });
    document.removeEventListener('mousedown', this.handleClick, true);
  };

  enableEditing = async () => {
    await this.setState({ editing: true, isActive: true });
    this.inputRef.current.focus();
    this.inputRef.current.selectionStart = this.getStepValue(
      'directions'
    ).length;
    document.addEventListener('mousedown', this.handleClick, true);
  };

  disableEditing = () => {
    this.setState({ editing: false });
  };

  handleClick = e => {
    if (!this.stepRef.current.contains(e.target)) {
      this.deactivateStep();
    } else if (e.target !== this.inputRef.current) {
      this.disableEditing();
    }
  };

  handleSelect = e => {
    const { isActive, editing } = this.state;

    e.preventDefault();
    document.removeEventListener('mousedown', this.handleClick, true);

    if (isActive && !editing) {
      this.enableEditing();
    } else if (!isActive) {
      this.activateStep();
    }
  };

  handleSave = e => {
    e.stopPropagation();
    this.disableEditing();
    if (!this.getStepValue('directions')) this.props.removeStep();
  };

  handleRemove = e => {
    e.stopPropagation();
    this.props.removeStep();
  };

  handleRestore = e => {
    e.stopPropagation();
    this.props.restoreStep();
  };

  handleCreateIngredient = e => {
    e.stopPropagation();
    this.props.createIngredient();
  };

  renderDirectionsWithMods = () => {
    const { step, removed } = this.props;
    const original = step.directions;

    if (removed) return <del>{original}</del>;

    const modified = this.getStepValue('directions');
    if (original !== modified) {
      return <DiffText original={original} modified={modified} />;
    }

    return original;
  };

  getStepValue = fieldName => {
    const { step, stepMods } = this.props;
    const mod = stepMods.find(
      mod => mod.sourceId === step.uid && mod.field === fieldName
    );

    return mod !== undefined ? mod.value : step[fieldName];
  };

  handleStepChange = e => {
    const { name, value } = e.target;
    const { step, removed, saveOrUpdateField, restoreStep } = this.props;
    if (removed) restoreStep();
    saveOrUpdateField(step, name, value);
  };

  render() {
    const { index, itemId, step, removed, children } = this.props;
    const { editing, isActive } = this.state;
    return (
      <Draggable type={`STEP-${itemId}`} draggableId={step.uid} index={index}>
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

              <div className={css.stepContents}>
                <form className={css.directions}>
                  {editing && (
                    <Textarea
                      inputRef={this.inputRef}
                      name="directions"
                      value={this.getStepValue('directions')}
                      placeholder="Directions"
                      onChange={this.handleStepChange}
                    />
                  )}

                  {!editing && (
                    <p
                      className={css.stepDirections}
                      onMouseDown={this.handleSelect}
                    >
                      {this.renderDirectionsWithMods()}
                    </p>
                  )}
                </form>

                {children && children({ editing, isActive })}

                <div className={css.stepActions}>
                  <TextButtonGroup>
                    {editing && (
                      <TextButton onClick={this.handleSave}>
                        <MdCheck /> save directions
                      </TextButton>
                    )}

                    {!editing && !removed && (
                      <TextButton
                        title="edit directions"
                        onClick={this.enableEditing}
                      >
                        <MdEdit /> edit directions
                      </TextButton>
                    )}

                    {!removed && (
                      <TextButton onClick={this.handleCreateIngredient}>
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
            </div>
          </li>
        )}
      </Draggable>
    );
  }
}
