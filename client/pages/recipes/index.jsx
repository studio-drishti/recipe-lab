import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Page from '../../layouts/Main';
import RecipesQuery from '../../graphql/Recipes.graphql';

export default class RecipesPage extends Component {
  static displayName = 'RecipesPage';

  static propTypes = {
    recipes: PropTypes.arrayOf(PropTypes.object)
  };

  static async getInitialProps({ apolloClient }) {
    const {
      data: { recipes }
    } = await apolloClient.query({
      query: RecipesQuery
    });
    return { recipes };
  }

  render() {
    const { recipes } = this.props;
    return (
      <Page>
        {recipes.map(recipe => (
          <div key={recipe.uid}>
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>
            <Link
              as={`/recipes/${recipe.slug}`}
              href={`/recipe?slug=${recipe.slug}`}
            >
              <a>Show me more!</a>
            </Link>
          </div>
        ))}
      </Page>
    );
  }
}
