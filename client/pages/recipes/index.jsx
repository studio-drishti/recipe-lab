import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Page from '../../layouts/Main';
import RecipesQuery from '../../graphql/RecipesQuery.graphql';

const RecipesPage = ({ recipes }) => (
  <Page>
    {recipes.map((recipe) => (
      <div key={recipe.uid}>
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>
        <Link href={'/recipes/[slug]'} as={`/recipes/${recipe.slug}`}>
          <a>Show me more!</a>
        </Link>
      </div>
    ))}
  </Page>
);

RecipesPage.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object),
};

RecipesPage.getInitialProps = async ({ apolloClient }) => {
  const {
    data: { recipes },
  } = await apolloClient.query({
    query: RecipesQuery,
  });
  return { recipes };
};

export default RecipesPage;
