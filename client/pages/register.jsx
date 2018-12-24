import React, { Component } from 'react';
import Layout from '../components/Layout';
import Register from '../components/Register';

export default class RegisterPage extends Component {
  static displayName = 'RegisterPage';

  render() {
    return (
      <Layout>
        <h1>Register</h1>
        <Register />
      </Layout>
    );
  }
}
