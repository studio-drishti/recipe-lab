import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdEdit, MdClear, MdCheck } from 'react-icons/md';
import classnames from 'classnames';

import css from './StepHeader.css';

export default class Step extends PureComponent {
  static displayName = 'Step';

  static propTypes = {
    activeStep: PropTypes.object,
    itemName: PropTypes.node,
    directions: PropTypes.node,
    navigation: PropTypes.node,
    children: PropTypes.node
  };

  state = {
    editing: false
  };

  stepRef = React.createRef();

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

  disableEditing = () => {
    this.setState({ editing: false });
    document.removeEventListener('mousedown', this.handleClick);
  };

  handleClick = e => {
    if (this.stepRef.current.contains(e.target)) return;
    this.disableEditing();
  };

  render() {
    const { itemName, directions, navigation } = this.props;
    const { editing } = this.state;
    return (
      <header
        ref={this.stepRef}
        className={classnames(css.stepHeader, {
          [css.editing]: editing
        })}
      >
        <div className={css.recipeDetailToolbar}>
          {itemName && React.cloneElement(itemName, { editing })}
          <div className={css.recipeNav}>{navigation}</div>
        </div>
        <div className={css.stepDirections} onClick={this.enableEditing}>
          {directions && React.cloneElement(directions, { editing })}
        </div>
        <div className={css.editActions}>
          {!editing && (
            <a
              href="javascript:void(0)"
              className={css.editBtn}
              onClick={this.enableEditing}
            >
              <MdEdit />
              edit step
            </a>
          )}

          {!editing && (
            <a href="javascript:void(0)">
              <MdClear />
              remove step
            </a>
          )}

          {editing && (
            <a href="javascript:void(0)" onClick={this.disableEditing}>
              <MdCheck />
              save changes
            </a>
          )}
        </div>
      </header>
    );
  }
}
