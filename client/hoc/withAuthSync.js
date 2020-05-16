import React, { useEffect, useContext } from 'react';
import Router from 'next/router';
import UserContext from '../context/UserContext';

const withAuthSync = (PageComponent) => {
  const Wrapper = (props) => {
    const { setUser } = useContext(UserContext);

    const syncLogout = (event) => {
      if (event.key === 'logout') {
        setUser(null);
        Router.push('/sign-in');
      }
    };

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      };
    }, []);

    return <PageComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    const pageProps =
      PageComponent.getInitialProps &&
      (await PageComponent.getInitialProps(ctx));
    return { ...pageProps };
  };

  return Wrapper;
};

export default withAuthSync;
