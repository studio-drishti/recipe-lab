import React, { Component } from 'react';
import css from './Footer.css';

export default class Footer extends Component {
  static displayName = 'Footer';

  render() {
    return (
      <footer className={css.footer}>
        <div className={css.copyright}>
          Copyright &copy; {new Date().getFullYear()} Recipe Lab
        </div>
        <div className={css.social}>
          <a href="#">Pixelfed</a> | <a href="#">Mastodon</a>
        </div>
      </footer>
    );
  }
}
