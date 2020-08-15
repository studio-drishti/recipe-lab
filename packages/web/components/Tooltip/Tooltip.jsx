import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useUID } from 'react-uid';
import css from './Tooltip.module.css';

const Tooltip = ({ children, className, tip }) => {
  const uid = useUID();
  return (
    <span className={classnames(css.tooltip, className)}>
      <span
        role="button"
        tabIndex={0}
        aria-describedby={`tooltip-${uid}`}
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.target.focus()}
      >
        {children}
      </span>
      <div id={`tooltip-${uid}`} role="tooltip">
        <div>{tip}</div>
      </div>
    </span>
  );
};

Tooltip.propTypes = {
  tip: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Tooltip;
