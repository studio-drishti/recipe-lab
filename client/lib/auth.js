import { useEffect } from 'react';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import Cookies from 'js-cookie';
import SessionUserQuery from '../graphql/SessionUserQuery.graphql';

export const checkLoggedIn = (apolloClient, fetchPolicy = 'cache-first') =>
  apolloClient
    .query({
      query: SessionUserQuery,
      fetchPolicy,
    })
    .then(({ data }) => {
      return { user: data.sessionUser };
    })
    .catch(() => {
      // Fail gracefully
      return { user: null };
    });

export const login = ({ token }) => {
  Cookies.set('token', token, { expires: 30 });
};

export const auth = (ctx = {}) => {
  const { token } = nextCookie(ctx);
  return Boolean(token);
};

export const logout = () => {
  Cookies.remove('token');
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now());
  Router.push('/sign-in');
};
