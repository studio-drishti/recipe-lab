import App from 'next/app';
import React, { useState } from 'react';
import 'normalize.css';
import 'filepond/dist/filepond.min.css';
import '../styles/variables.css';
import '../styles/global.css';
import UserContext from '../context/UserContext';
import withApollo from '../hoc/withApollo';
import withAuthSync from '../hoc/withAuthSync';
import { checkLoggedIn } from '../lib/auth';

const MyApp = ({ Component, pageProps, session }) => {
  const [user, setUser] = useState(session.user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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

export default withAuthSync(withApollo({ ssr: true })(MyApp));
