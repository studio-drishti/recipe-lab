import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './IngredientList.css';

export default class IngredientList extends Component {
  static displayName = 'IngredientList';

  static propTypes = {
    editing: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  render() {
    const { editing, children } = this.props;
    return (
      <ul className={css.ingredients} data-editing={editing}>
        {children}
      </ul>
    );
  }
}
