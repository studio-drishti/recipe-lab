import React from 'react';

import withAuthGuard from '../utils/withAuthGuard.jsx';

import Recipe from '../components/Recipe';
import Page from '../layouts/Main';

const NewRecipePage = () => (
  <Page>
    <Recipe />
  </Page>
);

export default withAuthGuard(NewRecipePage);
