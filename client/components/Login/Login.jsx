import React, { Component } from 'react';

import css from './Login.css';
import FormInput from '../FormInput';
import FormButton from '../FormButton';

export default class Register extends Component {
  static displayName = 'Login';

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
    return (
      <form className={css.form} onSubmit={this.handleSubmission}>
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
    );
  }
}
