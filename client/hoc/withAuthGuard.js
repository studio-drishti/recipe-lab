import React from 'react';
import Router from 'next/router';
import { auth } from '../lib/auth';

const withAuthGuard = (PageComponent) => {
  const WithAuthGuard = (pageProps) => {
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
