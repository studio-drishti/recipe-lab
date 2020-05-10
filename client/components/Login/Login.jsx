import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import Cookies from 'js-cookie';
import UserContext from '../../context/UserContext';
import SignInMutation from '../../graphql/SignInMutation.graphql';
import { getLocalStorageModifications } from '../../lib/recipe';
import FormInput from '../FormInput';
import FormButton from '../FormButton';
import css from './Login.module.css';

const Login = () => {
  const router = useRouter();
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
          login: { token, recipeModsCreated, recipeModsInConflict },
        },
      }) => {
        // Store the token in cookie
        Cookies.set('token', token, { expires: 30 });

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
            if (recipeModsInConflict.length > 0) {
              router.replace({
                pathname: '/conflict',
                query: {
                  returnTo: router.query.returnTo,
                  recipes: recipeModsInConflict.join(','),
                },
              });
            } else if (router.query.returnTo) {
              router.replace(
                '/recipes/[slug]',
                `/recipes/${router.query.returnTo}`
              );
            } else {
              router.replace('/chef/[slug]', `/chef/${user.slug}`);
            }
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
