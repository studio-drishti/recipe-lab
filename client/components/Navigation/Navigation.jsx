import React, { Component } from 'react';

import UserContext from '../../utils/UserContext';
import Link from 'next/link';
import css from './Navigation.css';

export default class Navigation extends Component {
  static displayName = 'Navigation';
  static contextType = UserContext;

  render() {
    const { user } = this.context;
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

          {user && (
            <Link href="/profile">
              <a>My Profile</a>
            </Link>
          )}

          {!user && (
            <Link href="/auth">
              <a>Login / Register</a>
            </Link>
          )}
        </div>
      </nav>
    );
  }
}
