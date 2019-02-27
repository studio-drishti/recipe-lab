import App, { Container } from 'next/app';
import React from 'react';
import { NextAuth } from 'next-auth/client';

import 'normalize.css';
import '../styles/variables.css';
import '../styles/global.css';

import UserContext from '../util/UserContext';

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {
      pageProps,
      session: await NextAuth.init({ req: ctx.req })
    };
  }

  refreshUser = async () => {
    const session = await NextAuth.init({ force: true });
    this.setState({ user: session.user, csrfToken: session.csrfToken });
  };

  state = {
    user: this.props.session.user,
    csrfToken: this.props.session.csrfToken,
    refreshUser: this.refreshUser
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <UserContext.Provider value={this.state}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </UserContext.Provider>
    );
  }
}
