import React, { useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import Page from '../../layouts/Main';
import Register from '../../components/Register';
import Login from '../../components/Login';
import UserContext from '../../context/UserContext';
import css from './signIn.module.css';

const SignInPage = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (!Cookies.get('token')) setUser(null);
  }, []);

  return (
    <Page>
      <div className={css.forms}>
        <div>
          <h1>Sign Up</h1>
          <Register />
        </div>
        <div>
          <h1>Sign In</h1>
          <Login />
        </div>
      </div>
    </Page>
  );
};

export default SignInPage;
