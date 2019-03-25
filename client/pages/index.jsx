import React, { Component } from 'react';
import Page from '../layouts/Main';

export default class IndexPage extends Component {
  static displayName = 'IndexPage';

  render() {
    return (
      <Page>
        <h1>Welcome to Recipe Lab!</h1>
        <p>Play with your food.</p>
      </Page>
    );
  }
}
