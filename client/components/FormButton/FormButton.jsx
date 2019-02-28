import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import css from './FormButton.css';

export default class FormButton extends PureComponent {
  static displayName = 'FormButton';

  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: null,
    type: 'submit'
  };

  render() {
    const { children, className, ...rest } = this.props;
    return (
      <button className={classnames(css.formButton, className)} {...rest}>
        {children}
      </button>
    );
  }
}
