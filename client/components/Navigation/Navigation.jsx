import React, { useContext } from 'react';
import Link from 'next/link';

import UserContext from '../../context/UserContext';

import css from './Navigation.module.css';

const Navigation = () => {
  const { user } = useContext(UserContext);
  return (
    <nav className={css.nav}>
      <Link href="/index" as="/">
        <a className={css.logo}>
          <img src="/static/logo.svg" />
        </a>
      </Link>
      <div className={css.links}>
        <Link href="/recipes">
          <a>Recipes</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>

        {user && (
          <>
            <Link href="/chef/[slug]" as={`/chef/${user.slug}`}>
              <a>My Profile</a>
            </Link>
            <Link href="/new-recipe">
              <a>+ New Recipe</a>
            </Link>
          </>
        )}

        {!user && (
          <Link href="/sign-in">
            <a>Sign In</a>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
