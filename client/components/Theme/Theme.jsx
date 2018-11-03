import PropTypes from 'prop-types';
import React from 'react';
import './Theme.css';

const Theme = ({ children }) => <div>{children}</div>;

Theme.propTypes = {
  children: PropTypes.element
};

export default Theme;
