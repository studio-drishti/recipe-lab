import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../Navigation';
import Footer from '../Footer';
import css from './Layout.css';

export default class Layout extends Component {
  static displayName = 'Layout';

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  render() {
    const { children } = this.props;
    return (
      <div className={css.container}>
        <Navigation />
        {children}
        <Footer />
      </div>
    );
  }
}
