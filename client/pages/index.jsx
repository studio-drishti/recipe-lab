import React, { Component } from 'react';
import Layout from '../components/Layout';

export default class IndexPage extends Component {
  static displayName = 'IndexPage';

  render() {
    return (
      <Layout>
        <h1>Welcome to Schooled Lunch!</h1>
        <p>Play with your food.</p>
      </Layout>
    );
  }
}
