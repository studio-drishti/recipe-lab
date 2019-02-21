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

  render() {
    const { Component, pageProps, session } = this.props;
    return (
      <UserContext.Provider value={session}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </UserContext.Provider>
    );
  }
}
