import App from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import 'normalize.css';
import '../styles/variables.css';
import '../styles/global.css';

import UserContext from '../context/UserContext';
import withApollo from '../utils/withApollo.jsx';
import checkLoggedIn from '../utils/checkLoggedIn';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {
      pageProps,
      session: await checkLoggedIn(ctx.apolloClient),
    };
  }

  refreshUser = async () => {
    const session = await checkLoggedIn(
      this.props.apolloClient,
      'network-only'
    );
    this.setState({ user: session.user });
    return session.user;
  };

  state = {
    user: this.props.session.user,
    refreshUser: this.refreshUser,
  };

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <UserContext.Provider value={this.state}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
