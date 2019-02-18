import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import css from './TextButton.css';

export default class TextButton extends PureComponent {
  static displayName = 'TextButton';

  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: null
  };

  render() {
    const { children, className, ...rest } = this.props;
    return (
      <button className={classnames(css.textButton, className)} {...rest}>
        {children}
      </button>
    );
  }
}
