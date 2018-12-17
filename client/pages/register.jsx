import React from 'react';
import Layout from '../components/Layout';
import Register from '../components/Register';
const RegisterPage = () => (
  <Layout>
    <h1>Register</h1>
    <Register />
  </Layout>
);

RegisterPage.displayName = 'RegisterPage';
export default RegisterPage;
