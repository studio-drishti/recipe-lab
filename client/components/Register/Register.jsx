import React, { Component } from 'react';
import css from './Register.css';

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
    const { firstName, lastName, email, password } = this.state;
    return (
      <form className={css.form} onSubmit={this.handleSubmission}>
        <label>
          First Name
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleInputChange}
          />
        </label>
        <button type="submit">Regsiter</button>
      </form>
    );
  }
}
