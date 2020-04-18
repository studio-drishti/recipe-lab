import React, { useState, useContext, useRef } from 'react';
import { useMutation } from 'react-apollo';
import isEmail from 'validator/lib/isEmail';
import cookie from 'cookie';
import redirect from '../../utils/redirect';
import UserContext from '../../context/UserContext';
import SignUpMutation from '../../graphql/SignUpMutation.graphql';
import { getLocalStorageModifications } from '../../utils/recipe';
import FormInput from '../FormInput';
import FormButton from '../FormButton';
import css from './Register.module.css';

const Register = () => {
  const validationTimeouts = useRef({});
  const [signUp, { error, client }] = useMutation(SignUpMutation);
  const { refreshUser } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [edits, setEdits] = useState({
    password: '',
    name: '',
    email: ''
  });

  const validate = (fieldName, value) => {
    let err = undefined;

    switch (fieldName) {
      case 'name':
        if (value.length < 1 || value.length > 125)
          err = 'Your display name must be between 1 and 125 characters';
        break;
      case 'email':
        if (!isEmail(value)) err = 'Please enter a valid email address';
        break;
      case 'password':
        if (value.length < 8 || value.length > 125) {
          err = 'Password must be between 8 and 125 characters';
        }
        break;
    }

    setErrors(errors => ({
      ...errors,
      [fieldName]: err
    }));

    return Boolean(!err);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (validationTimeouts.current[name])
      clearTimeout(validationTimeouts.current[name]);

    setEdits({
      ...edits,
      [name]: value
    });

    validationTimeouts.current[name] = setTimeout(() => {
      validate(name, value);
      delete validationTimeouts.current[name];
    }, 1000);
  };

  const handleSubmission = e => {
    e.preventDefault();

    const haveErrors = Object.entries(edits).filter(
      ([key, value]) => !validate(key, value)
    );

    if (haveErrors.length > 0) return;

    const variables = { ...edits };

    const mods = getLocalStorageModifications();
    if (mods.length) variables.modifications = mods;

    signUp({ variables }).then(
      ({
        data: {
          signup: { token, recipeModsCreated }
        }
      }) => {
        // Store the token in cookie
        document.cookie = cookie.serialize('token', token, {
          maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        // Remove any mods from localstorage that were created on the server
        recipeModsCreated.forEach(recipeId => {
          localStorage.removeItem(`MOD-${recipeId}`);
        });

        // Force a reload of all the current queries now that the user is logged in
        client.cache
          .reset()
          .then(() => {
            return refreshUser();
          })
          .then(user => {
            redirect({}, `/chef/${user.slug}`);
          });
      }
    );
  };

  return (
    <form className={css.form} onSubmit={handleSubmission}>
      {error && <p>Oh no! Something went wrong.</p>}
      <FormInput
        label="Name"
        name="name"
        value={edits.name}
        onChange={handleInputChange}
        error={errors.name}
      />
      <FormInput
        label="Email"
        name="email"
        value={edits.email}
        onChange={handleInputChange}
        error={errors.email}
      />
      <FormInput
        label="Password"
        type="password"
        name="password"
        value={edits.password}
        onChange={handleInputChange}
        error={errors.password}
      />
      <FormButton>Register</FormButton>
    </form>
  );
};

export default Register;
