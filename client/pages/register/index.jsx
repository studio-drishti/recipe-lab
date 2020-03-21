import React from 'react';
import Page from '../../layouts/Main';
import Register from '../../components/Register';
import Login from '../../components/Login';
import css from './register.module.css';

const RegisterPage = () => (
  <Page>
    <div className={css.forms}>
      <div>
        <h1>Register</h1>
        <Register />
      </div>
      <div>
        <h1>Login</h1>
        <Login />
      </div>
    </div>
  </Page>
);

export default RegisterPage;
