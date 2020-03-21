import React, { Component } from 'react';

import css from './Register.module.css';
import FormInput from '../FormInput';
import FormButton from '../FormButton';

export default class Register extends Component {
  static displayName = 'Register';

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
    const { name, email, password } = this.state;
    return (
      <form className={css.form} onSubmit={this.handleSubmission}>
        <FormInput
          label="Name"
          name="name"
          value={name}
          onChange={this.handleInputChange}
        />
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
        <FormButton>Register</FormButton>
      </form>
    );
  }
}
