import React, { Component } from 'react';
import css from './Footer.css';

export default class Footer extends Component {
  static displayName = 'Footer';

  render() {
    return (
      <footer className={css.footer}>
        <div className={css.copyright}>
          Copyright &copy; {new Date().getFullYear()} Schooled Lunch
        </div>
        <div className={css.social}>
          <a href="#">Instagram</a> |<a href="#">Facebook</a> |
          <a href="#">Mastadon</a>
        </div>
      </footer>
    );
  }
}
