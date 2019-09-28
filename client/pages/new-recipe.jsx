import React, { Component } from 'react';

import withAuthGuard from '../utils/withAuthGuard';

import Recipe from '../components/Recipe';
import Page from '../layouts/Main';

class NewRecipePage extends Component {
  static displayName = 'NewRecipePage';

  render() {
    return (
      <Page>
        <Recipe />
      </Page>
    );
  }
}

export default withAuthGuard(NewRecipePage);
