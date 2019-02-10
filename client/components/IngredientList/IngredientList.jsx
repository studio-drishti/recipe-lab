import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdAdd } from 'react-icons/md';

import css from './IngredientList.css';

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

  render() {
    const { editing, children, createIngredient } = this.props;
    return (
      <>
        <ul className={css.ingredients} data-editing={editing}>
          {children}
        </ul>
        <div className={css.listActions}>
          <a href="javascript:void(0)" onClick={createIngredient}>
            <MdAdd /> add ingredient
          </a>
        </div>
      </>
    );
  }
}
