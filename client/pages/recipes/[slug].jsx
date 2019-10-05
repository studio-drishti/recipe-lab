import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../layouts/Main';
import Recipe from '../../components/Recipe';
import RecipeWithModificationQuery from '../../graphql/RecipeWithModification.graphql';

const IndexPage = ({
  modification,
  recipe
}) => (
      <Page>
        <Recipe recipe={recipe} modification={modification} />
      </Page>
);

IndexPage.propTypes = {
  modification: PropTypes.object,
  recipe: PropTypes.object
};

IndexPage.getInitialProps = async ({query, apolloClient}) {
const { slug } = query;
    const { data } = await apolloClient.query({
      query: RecipeWithModificationQuery,
      variables: {
        slug
      }
    });
    const { modification, ...recipe } = data.recipe;
    return {
      modification,
      recipe
    };
};

export default IndexPage;
