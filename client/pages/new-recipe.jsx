import React, { Component } from 'react';

import Recipe from '../components/Recipe';
import Page from '../layouts/Main';

export default class RecipesPage extends Component {
  static displayName = 'RecipesPage';

  render() {
    return (
      <Page>
        <Recipe />
      </Page>
    );
  }
}
