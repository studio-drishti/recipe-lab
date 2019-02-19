import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import css from './TextButtonGroup.css';

export default class TextButton extends PureComponent {
  static displayName = 'TextButtonGroup';

  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: null
  };

  render() {
    const { children, className, ...rest } = this.props;
    return (
      <div className={classnames(css.textButtonGroup, className)} {...rest}>
        {children}
      </div>
    );
  }
}
