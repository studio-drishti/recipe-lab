import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../layouts/Main';
import Recipe from '../../components/Recipe';
import RecipeWithModificationQuery from '../../graphql/RecipeWithModification.graphql';

const IndexPage = ({ modification, recipe, placeholderPhoto }) => (
  <Page>
    <Recipe
      recipe={recipe}
      modification={modification}
      placeholderPhoto={placeholderPhoto}
    />
  </Page>
);

IndexPage.propTypes = {
  modification: PropTypes.object,
  recipe: PropTypes.object,
  placeholderPhoto: PropTypes.string
};

IndexPage.getInitialProps = async ({ query, apolloClient }) => {
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
    recipe,
    placeholderPhoto: `/static/placeholders/recipe-${Math.floor(
      Math.random() * 3 + 1
    )}.jpg`
  };
};

export default IndexPage;
