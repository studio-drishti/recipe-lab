import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import css from './IconButton.css';

export default class IconButton extends PureComponent {
  static displayName = 'IconButton';

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any
  };

  static defaultProps = {
    className: null
  };

  render() {
    const { children, className, ...rest } = this.props;
    return (
      <button className={classnames(css.iconButton, className)} {...rest}>
        {children}
      </button>
    );
  }
}
