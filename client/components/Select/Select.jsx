import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MdWarning } from 'react-icons/md';
import Tooltip from '../Tooltip';
import css from './Select.module.css';

const Select = ({ error, className, inputRef, children, ...props }) => (
  <div
    className={classnames(className, css.inputContainer, {
      [css.hasError]: error
    })}
  >
    <select ref={inputRef} {...props}>
      {children}
    </select>
    {error && (
      <Tooltip tip={error} className={css.errorIcon}>
        <MdWarning />
      </Tooltip>
    )}
  </div>
);

Select.propTypes = {
  error: PropTypes.string,
  className: PropTypes.string,
  inputRef: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

Select.defaultProps = {
  type: 'text'
};

export default Select;
