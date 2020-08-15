import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MdWarning } from 'react-icons/md';
import TextareaAutosize from 'react-textarea-autosize';
import Tooltip from '../Tooltip';
import css from './Textarea.module.css';

const Textarea = ({ error, className, inputRef, ...props }) => (
  <div
    className={classnames(className, css.inputContainer, {
      [css.hasError]: error,
    })}
  >
    <TextareaAutosize ref={inputRef} {...props} />
    {error && (
      <Tooltip tip={error} className={css.errorIcon}>
        <MdWarning />
      </Tooltip>
    )}
  </div>
);

Textarea.propTypes = {
  error: PropTypes.string,
  className: PropTypes.string,
};

Textarea.defaultProps = {
  type: 'text',
};

export default Textarea;
