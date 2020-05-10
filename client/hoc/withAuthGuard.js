import React from 'react';
import Router from 'next/router';
import { checkLoggedIn } from '../lib/auth';

const withAuthGuard = (PageComponent) => {
  const WithAuthGuard = (pageProps) => {
    return <PageComponent {...pageProps} />;
  };

  WithAuthGuard.getInitialProps = async (ctx) => {
    const session = await checkLoggedIn(ctx.apolloClient);

    if (session.user) {
      const pageProps = await PageComponent.getInitialProps(ctx);
      return { ...pageProps };
    }

    if (typeof window === 'undefined') {
      ctx.res.writeHead(302, { Location: '/sign-in' });
      ctx.res.end();
    } else {
      // In the browser, we just pretend like this never even happened ;)
      Router.replace('/sign-in');
    }
  };
  return WithAuthGuard;
};

export default withAuthGuard;
