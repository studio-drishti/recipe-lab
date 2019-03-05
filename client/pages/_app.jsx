import App, { Container } from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
// import { NextAuth } from 'next-auth/client';

import 'normalize.css';
import '../styles/variables.css';
import '../styles/global.css';

import UserContext from '../utils/UserContext';
import withApollo from '../utils/withApollo';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {
      pageProps,
      // session: await NextAuth.init({ req: ctx.req })
      session: {
        user: 'fake',
        csrfToken: '123'
      }
    };
  }

  // refreshUser = async () => {
  //   const session = await NextAuth.init({ force: true });
  //   this.setState({ user: session.user, csrfToken: session.csrfToken });
  // };
  refreshUser = () => {};

  state = {
    user: this.props.session.user,
    csrfToken: this.props.session.csrfToken,
    refreshUser: this.refreshUser
  };

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <UserContext.Provider value={this.state}>
            <Component {...pageProps} />
          </UserContext.Provider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(MyApp);
