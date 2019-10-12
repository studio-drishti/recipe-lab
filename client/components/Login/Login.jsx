import React, { useContext, useEffect, useState } from 'react';
import { withApollo } from 'react-apollo';
import { useApolloClient } from 'react-apollo';
import { useMutation } from 'react-apollo';
import cookie from 'cookie';
import redirect from '../../utils/redirect';

import UserContext from '../../utils/UserContext';

import css from './Login.css';
import FormInput from '../FormInput';
import FormButton from '../FormButton';
import SignInMutation from '../../graphql/SignIn.graphql';

const Login = () => {
  const client = useApolloClient();
  const [signIn, { error }] = useMutation(SignInMutation);
  const { refreshUser } = useContext(UserContext);
  const [fields, setFields] = useState({ email: '', password: '' });

  useEffect(() => {
    return () => {
      document.removeEventListener(handleSubmission, handleInputChange);
    };
  }, []);

  const handleInputChange = e => {
    const { value, name } = e.target;

    setFields({
      ...fields,
      [name]: value
    });
  };

  const handleSubmission = e => {
    e.preventDefault();
    signIn({
      variables: fields
    }).then(({ data }) => {
      // Store the token in cookie
      document.cookie = cookie.serialize('token', data.login.token, {
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
      // Force a reload of all the current queries now that the user is
      // logged in
      client.cache
        .reset()
        .then(() => {
          return refreshUser();
        })
        .then(() => {
          redirect({}, '/profile');
        });
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmission}>
      {error && <p>No user found with that information.</p>}
      <FormInput
        label="Email"
        name="email"
        value={fields.email}
        onChange={handleInputChange}
      />
      <FormInput
        label="Password"
        type="password"
        name="password"
        value={fields.password}
        onChange={handleInputChange}
      />
      <FormButton>Login</FormButton>
    </form>
  );
};

export default withApollo(Login);
