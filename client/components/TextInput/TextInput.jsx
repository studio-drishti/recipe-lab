import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MdWarning } from 'react-icons/md';

import css from './TextInput.css';

const TextInput = ({ error, className, inputRef, ...props }) => (
  <div
    className={classnames(className, css.inputContainer, {
      [css.hasError]: error
    })}
  >
    <input ref={inputRef} {...props} />
    {error && (
      <span className={css.errorIcon}>
        <MdWarning />
      </span>
    )}
  </div>
);

TextInput.propTypes = {
  error: PropTypes.string,
  className: PropTypes.string,
  inputRef: PropTypes.object
};

TextInput.defaultProps = {
  type: 'text'
};

export default TextInput;
