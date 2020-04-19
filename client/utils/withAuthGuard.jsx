import React, { Component } from 'react';

import redirect from './redirect';
import checkLoggedIn from './checkLoggedIn';

// Gets the display name of a JSX component for dev tools
const getDisplayName = (Component) =>
  Component.displayName || Component.name || 'Component';

export default (Page) =>
  class extends Component {
    static displayName = `withAuthGuard(${getDisplayName(Page)})`;

    static async getInitialProps(ctx) {
      const session = await checkLoggedIn(ctx.apolloClient);

      if (!session.user) return redirect(ctx, '/register');

      const componentProps =
        Page.getInitialProps && (await Page.getInitialProps(ctx));

      return { ...componentProps };
    }

    render() {
      return <Page {...this.props} />;
    }
  };
