import React, { Component } from 'react';
import PropTypes from 'prop-types';

import css from './ItemName.css';
import DiffText from '../DiffText';

export default class Ingredient extends Component {
  static displayName = 'ItemName';

  static propTypes = {
    item: PropTypes.object,
    mod: PropTypes.string,
    editing: PropTypes.bool,
    removed: PropTypes.bool,
    handleItemChange: PropTypes.func,
    inputRef: PropTypes.shape({
      current: PropTypes.any
    }),
    prefix: PropTypes.string,
    suffix: PropTypes.string
  };

  static defaultProps = {
    mod: undefined,
    editing: false,
    removed: false
  };

  renderNameWithMods = () => {
    const { mod, item } = this.props;
    if (mod !== undefined) {
      return <DiffText original={item.name} modified={mod} />;
    } else {
      return item.name;
    }
  };

  getNameValue = () => {
    const { mod, item } = this.props;
    return mod !== undefined ? mod : item.name;
  };

  render() {
    const {
      editing,
      item,
      handleItemChange,
      inputRef,
      prefix,
      suffix
    } = this.props;

    return (
      <form className={css.itemName}>
        {editing ? (
          <input
            type="text"
            name="name"
            value={this.getNameValue()}
            ref={inputRef}
            placeholder="Item name"
            onChange={e => handleItemChange(e, item)}
          />
        ) : (
          <h3>
            {prefix && prefix + ' '}
            {this.renderNameWithMods()}
            {suffix && ' ' + suffix}
          </h3>
        )}
      </form>
    );
  }
}
