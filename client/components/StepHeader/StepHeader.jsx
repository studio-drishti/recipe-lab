import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdEdit, MdClear, MdCheck, MdRefresh } from 'react-icons/md';
import classnames from 'classnames';

import css from './StepHeader.css';
import TextButton from '../TextButton';

export default class Step extends PureComponent {
  static displayName = 'Step';

  static propTypes = {
    activeStep: PropTypes.object,
    itemName: PropTypes.node,
    directions: PropTypes.node,
    navigation: PropTypes.node,
    children: PropTypes.node,
    removed: PropTypes.bool,
    removeStep: PropTypes.func,
    restoreStep: PropTypes.func
  };

  state = {
    editing: false,
    removed: false
  };

  stepRef = React.createRef();
  nameInputRef = React.createRef();
  directionsInputRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (
      'activeStep' in prevProps &&
      this.props.activeStep._id !== prevProps.activeStep._id
    ) {
      this.disableEditing();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  enableEditing = () => {
    this.setState({ editing: true });
    document.addEventListener('mousedown', this.handleClick);
  };

  enableEditingDirections = async () => {
    await this.enableEditing();
    if (this.directionsInputRef.current)
      this.directionsInputRef.current.focus();
  };

  enableEditingItemName = async () => {
    await this.enableEditing();
    if (this.nameInputRef.current) this.nameInputRef.current.focus();
  };

  disableEditing = () => {
    this.setState({ editing: false });
    document.removeEventListener('mousedown', this.handleClick);
  };

  handleClick = e => {
    if (this.stepRef.current.contains(e.target)) return;
    this.disableEditing();
  };

  handleRemove = () => {
    this.props.removeStep();
  };

  handleRestore = () => {
    this.props.restoreStep();
  };

  render() {
    const {
      itemName,
      directions,
      navigation,
      removed,
      restoreStep
    } = this.props;
    const { editing } = this.state;
    return (
      <header
        ref={this.stepRef}
        className={classnames(css.stepHeader, {
          [css.editing]: editing
        })}
      >
        <div className={css.recipeDetailToolbar}>
          <div className={css.itemName} onClick={this.enableEditingItemName}>
            {itemName &&
              React.cloneElement(itemName, {
                editing,
                inputRef: this.nameInputRef
              })}
          </div>
          <div className={css.recipeNav}>{navigation}</div>
        </div>
        <div
          className={css.stepDirections}
          onClick={this.enableEditingDirections}
        >
          {directions &&
            React.cloneElement(directions, {
              editing,
              removed,
              restoreStep,
              inputRef: this.directionsInputRef
            })}
        </div>
        <div className={css.editActions}>
          {!editing && !removed && (
            <>
              <TextButton
                className={css.editBtn}
                onClick={this.enableEditingDirections}
              >
                <MdEdit />
                edit step
              </TextButton>
              <TextButton onClick={this.handleRemove}>
                <MdClear />
                remove step
              </TextButton>
            </>
          )}

          {!editing && removed && (
            <TextButton onClick={this.handleRestore}>
              <MdRefresh />
              restore step
            </TextButton>
          )}

          {editing && (
            <TextButton onClick={this.disableEditing}>
              <MdCheck />
              save changes
            </TextButton>
          )}
        </div>
      </header>
    );
  }
}
