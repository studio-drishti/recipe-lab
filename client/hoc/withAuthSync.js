import React, { useEffect } from 'react';

const withAuthSync = (PageComponent) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
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
