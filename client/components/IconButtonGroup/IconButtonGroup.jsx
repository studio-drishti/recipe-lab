import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import css from './IconButtonGroup.module.css';

export default class IconButton extends PureComponent {
  static displayName = 'IconButtonGroup';

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
      <div className={classnames(css.iconButtonGroup, className)} {...rest}>
        {children}
      </div>
    );
  }
}
