import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Theme.css';

export default class Theme extends Component {
  static propTypes = {
    children: PropTypes.element
  };

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}
