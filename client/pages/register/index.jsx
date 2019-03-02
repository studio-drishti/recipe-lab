import React, { Component } from 'react';

import css from './register.css';
import Page from '../../layouts/Main';
import Register from '../../components/Register';
import Login from '../../components/Login';

export default class RegisterPage extends Component {
  static displayName = 'RegisterPage';

  render() {
    return (
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
  }
}
