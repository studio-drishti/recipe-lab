import React, { Component } from 'react';
import Link from 'next/link';
import css from './Navigation.css';

export default class Navigation extends Component {
  static displayName = 'Navigation';

  render() {
    return (
      <nav className={css.nav}>
        <Link href="/">
          <a className={css.logo}>Schooled Lunch</a>
        </Link>
        <div className={css.links}>
          <Link href="/recipes">
            <a>Recipes</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/register">
            <a>Register</a>
          </Link>
        </div>
      </nav>
    );
  }
}
