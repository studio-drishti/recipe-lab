import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import RecipesQuery from '../graphql/RecipesQuery.graphql';
import Page from '../layouts/Main';

// Because ConflictResolution depends on localStorage, use dynamic import
// to prevent loading during server side rendering.
const ConflictResolution = dynamic(
  () => import('../components/ConflictResolution'),
  { ssr: false }
);

const IndexPage = ({ recipes }) => (
  <Page>
    <ConflictResolution recipes={recipes} />
  </Page>
);

IndexPage.propTypes = {
  recipes: PropTypes.array,
};

IndexPage.getInitialProps = async ({ query, apolloClient }) => {
  const { recipes } = query;
  const { data } = await apolloClient.query({
    query: RecipesQuery,
    variables: {
      where: {
        uid_in: recipes.split(','),
      },
    },
  });
  return {
    recipes: data.recipes,
  };
};

export default IndexPage;
