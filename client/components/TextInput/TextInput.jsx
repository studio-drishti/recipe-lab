import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MdWarning } from 'react-icons/md';
import Tooltip from '../Tooltip';
import css from './TextInput.module.css';

const TextInput = ({ error, className, inputRef, ...props }) => (
  <div
    className={classnames(className, css.inputContainer, {
      [css.hasError]: error,
    })}
  >
    <input ref={inputRef} {...props} />
    {error && (
      <Tooltip tip={error} className={css.errorIcon}>
        <MdWarning />
      </Tooltip>
    )}
  </div>
);

TextInput.propTypes = {
  error: PropTypes.string,
  className: PropTypes.string,
  inputRef: PropTypes.object,
};

TextInput.defaultProps = {
  type: 'text',
};

export default TextInput;
