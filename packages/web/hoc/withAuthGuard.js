import React, { useContext } from 'react';
import Router from 'next/router';
import Error from 'next/error';
import UserContext from '../context/UserContext';
import { auth } from '../lib/auth';

const withAuthGuard = (...allowedRoles) => (PageComponent) => {
  const WithAuthGuard = (pageProps) => {
    const { user } = useContext(UserContext);

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Error statusCode={403} title="Forbidden" />;
    }

    return <PageComponent {...pageProps} />;
  };

  WithAuthGuard.getInitialProps = async (ctx) => {
    if (!auth(ctx)) {
      if (typeof window === 'undefined') {
        ctx.res.writeHead(302, { Location: '/sign-in' });
        ctx.res.end();
      } else {
        Router.replace('/sign-in');
      }
    }
    const pageProps = await PageComponent.getInitialProps(ctx);
    return { ...pageProps };
  };

  return WithAuthGuard;
};

export default withAuthGuard;
