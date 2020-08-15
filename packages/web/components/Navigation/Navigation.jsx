import React, { useContext, useState } from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import { useApolloClient } from '@apollo/client';
import { logout } from '../../lib/auth';
import UserContext from '../../context/UserContext';
import css from './Navigation.module.css';

const Navigation = () => {
  const [isOpen, setOpen] = useState(false);
  const { user } = useContext(UserContext);
  const apolloClient = useApolloClient();

  const signOut = () => {
    apolloClient.cache.reset().then(() => {
      logout();
    });
  };

  return (
    <header className={css.header}>
      <figure className={css.logo}>
        <Link href="/index" as="/">
          <a>
            <img src="/static/logo.svg" />
          </a>
        </Link>
      </figure>

      <nav className={css.nav}>
        <button
          className={css.mobileMenuBtn}
          onClick={() => setOpen(!isOpen)}
          title="Menu"
        />
        <ul className={classnames({ [css.closed]: !isOpen })}>
          <li>
            <Link href="/recipes">
              <a>Recipes</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link href="/chef/[slug]" as={`/chef/${user.slug}`}>
                  <a>My Profile</a>
                </Link>
              </li>
              <li>
                <Link href="/new-recipe">
                  <a>+ New Recipe</a>
                </Link>
              </li>
            </>
          )}
          {!user ? (
            <li>
              <Link href="/sign-in">
                <a>Sign In</a>
              </Link>
            </li>
          ) : (
            <li>
              <button onClick={signOut}>Sign Out</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
