import React from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import css from './Main.module.css';

const MainLayout = ({ children }) => (
  <div className={css.container}>
    <Navigation />
    {children}
    <Footer />
  </div>
);

export default MainLayout;
