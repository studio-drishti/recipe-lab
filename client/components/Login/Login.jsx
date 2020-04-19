import React, { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';
import cookie from 'cookie';
import redirect from '../../utils/redirect';
import UserContext from '../../context/UserContext';
import SignInMutation from '../../graphql/SignInMutation.graphql';
import { getLocalStorageModifications } from '../../utils/recipe';
import FormInput from '../FormInput';
import FormButton from '../FormButton';
import css from './Login.module.css';

const Login = () => {
  const [signIn, { error, client }] = useMutation(SignInMutation);
  const { refreshUser } = useContext(UserContext);
  const [fields, setFields] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    const variables = { ...fields };

    const mods = getLocalStorageModifications();
    if (mods.length) variables.modifications = mods;

    signIn({ variables }).then(
      ({
        data: {
          login: { token, recipeModsCreated },
        },
      }) => {
        // Store the token in cookie
        document.cookie = cookie.serialize('token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        // Remove any mods from localstorage that were created on the server
        recipeModsCreated.forEach((recipeId) => {
          localStorage.removeItem(`MOD-${recipeId}`);
        });

        // Force a reload of all the current queries now that the user is logged in
        client.cache
          .reset()
          .then(() => {
            return refreshUser();
          })
          .then((user) => {
            redirect({}, `/chef/${user.slug}`);
          });
      }
    );
  };

  return (
    <form className={css.form} onSubmit={handleSubmission}>
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
      {error && <p>No user found with that information.</p>}
      <FormButton>Login</FormButton>
    </form>
  );
};

export default Login;
