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
    innerRef: PropTypes.object,
    autoFocus: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string
  };

  static defaultProps = {
    mod: undefined,
    editing: false,
    removed: false,
    autoFocus: true
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.autoFocus &&
      this.props.innerRef &&
      !prevProps.editing &&
      this.props.editing
    ) {
      this.props.innerRef.current.focus();
    }
  }

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
      innerRef,
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
            ref={innerRef}
            placeholder="Item name"
            onChange={e => handleItemChange(e, item._id)}
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
