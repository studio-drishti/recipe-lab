import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdAdd } from 'react-icons/md';
import classnames from 'classnames';

import css from './IngredientList.css';
import TextButton from '../TextButton';

export default class IngredientList extends Component {
  static displayName = 'IngredientList';

  static propTypes = {
    editing: PropTypes.bool,
    createIngredient: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  handleCreate = () => {
    const { editing, createIngredient } = this.props;
    if (!editing) createIngredient();
  };

  render() {
    const { editing, children } = this.props;
    return (
      <>
        {children.length > 0 && (
          <ul className={css.ingredients} data-editing={editing}>
            {children}
          </ul>
        )}
        <div
          className={classnames(css.listActions, { [css.editing]: editing })}
        >
          <TextButton onClick={this.handleCreate}>
            <MdAdd /> add ingredient
          </TextButton>
        </div>
      </>
    );
  }
}
