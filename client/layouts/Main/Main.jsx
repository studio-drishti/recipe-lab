import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import css from './Main.module.css';

export default class Layout extends Component {
  static displayName = 'MainLayout';

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
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
