import React, { Component } from 'react';
import Page from '../layouts/Main';
import Register from '../components/Register';

export default class RegisterPage extends Component {
  static displayName = 'RegisterPage';

  render() {
    return (
      <Page>
        <h1>Register</h1>
        <Register />
      </Page>
    );
  }
}
