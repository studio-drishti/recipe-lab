import React from 'react';
import Page from '../../layouts/Main';
import Register from '../../components/Register';
import Login from '../../components/Login';
import css from './signIn.module.css';

const SignInPage = () => (
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

export default SignInPage;
