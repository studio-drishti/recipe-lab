import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './FormButton.module.css';

const FormButton = ({ children, className, ...props }) => (
  <button className={classnames(css.formButton, className)} {...props}>
    {children}
  </button>
);

FormButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any
};

FormButton.defaultProps = {
  className: null,
  type: 'submit'
};

export default FormButton;
