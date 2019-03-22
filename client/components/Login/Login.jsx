import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation, withApollo } from 'react-apollo';
import { ApolloClient } from 'apollo-boost';
import cookie from 'cookie';
import redirect from '../../utils/redirect';

import UserContext from '../../utils/UserContext';

import css from './Login.css';
import FormInput from '../FormInput';
import FormButton from '../FormButton';
import SignInMutation from '../../graphql/SignIn.graphql';

class Login extends Component {
  static displayName = 'Login';
  static contextType = UserContext;
  static propTypes = {
    client: PropTypes.instanceOf(ApolloClient)
  };

  state = {
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  };

  handleInputChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmission = e => {
    e.preventDefault();
  };

  render() {
    const { email, password } = this.state;
    const { client } = this.props;
    const { refreshUser } = this.context;
    return (
      <Mutation
        mutation={SignInMutation}
        onCompleted={data => {
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
        }}
      >
        {(login, { error }) => (
          <form
            className={css.form}
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();

              login({
                variables: {
                  email,
                  password
                }
              });

              this.setState({ password: '' });
            }}
          >
            {error && <p>No user found with that information.</p>}
            <FormInput
              label="Email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
            />
            <FormButton>Login</FormButton>
          </form>
        )}
      </Mutation>
    );
  }
}

export default withApollo(Login);
