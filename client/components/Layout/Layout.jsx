import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../Navigation';
import Footer from '../Footer';
import css from './Layout.css';

const Layout = ({ children }) => (
  <div className={css.container}>
    <Navigation />
    {children}
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default Layout;
