import React from 'react';
import PropTypes from 'prop-types';
import RecipesQuery from '../graphql/RecipesQuery.graphql';
import Page from '../layouts/Main';
import ConflictResolution from '../components/ConflictResolution';

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
