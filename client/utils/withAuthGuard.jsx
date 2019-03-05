import React, { Component } from 'react';
import Router from 'next/router';
import { NextAuth } from 'next-auth/client';

// Gets the display name of a JSX component for dev tools
const getDisplayName = Component =>
  Component.displayName || Component.name || 'Component';

export default WrappedComponent =>
  class extends Component {
    static displayName = `withAuthGuard(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const session = await NextAuth.init({ req: ctx.req });
      if (!('user' in session)) {
        process.browser
          ? Router.push('/auth/error?action=signin')
          : ctx.res.writeHead(301, { Location: '/auth/error?action=signin' });
        return;
      }

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
