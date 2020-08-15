import React from 'react';
import css from './Footer.module.css';

const Footer = () => (
  <footer className={css.footer}>
    <div className={css.copyright}>
      Copyright &copy; {new Date().getFullYear()} Recipe Lab
    </div>
    <div className={css.social}>
      <a href="https://instagram.com/recipelab.io">Instagram</a> |{' '}
      <a href="#">Facebook</a>
    </div>
  </footer>
);

export default Footer;
