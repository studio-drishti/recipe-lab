import App from 'next/app';
import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import 'normalize.css';
import '../styles/variables.css';
import '../styles/global.css';
import UserContext from '../context/UserContext';
import withApollo from '../hoc/withApollo.js';
import checkLoggedIn from '../utils/checkLoggedIn';

const MyApp = ({ Component, pageProps, session }) => {
  const apolloClient = useApolloClient();
  const [user, setUser] = useState(session.user);

  const refreshUser = async () => {
    const session = await checkLoggedIn(apolloClient, 'network-only');
    setUser(session.user);
    return session.user;
  };

  return (
    <UserContext.Provider value={{ user, refreshUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const session = await checkLoggedIn(appContext.apolloClient);
  return { ...appProps, session };
};
// class MyApp extends App {
//   static async getInitialProps({ Component, ctx }) {
//     let pageProps = {};

//     if (Component.getInitialProps) {
//       pageProps = await Component.getInitialProps(ctx);
//     }

//     return {
//       pageProps,
//       session: await checkLoggedIn(ctx.apolloClient),
//     };
//   }

//   refreshUser = async () => {
//     const session = await checkLoggedIn(
//       this.props.apolloClient,
//       'network-only'
//     );
//     this.setState({ user: session.user });
//     return session.user;
//   };

//   state = {
//     user: this.props.session.user,
//     refreshUser: this.refreshUser,
//   };

//   render() {
//     const { Component, pageProps } = this.props;
//     return (
//       <UserContext.Provider value={this.state}>
//         <Component {...pageProps} />
//       </UserContext.Provider>
//     );
//   }
// }

export default withApollo({ ssr: true })(MyApp);
