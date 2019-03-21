import React, { Component } from 'react';
import Link from 'next/link';
import { Query } from 'react-apollo';

import Page from '../layouts/Main';
import RecipesQuery from '../graphql/Recipes.graphql';

export default class RecipesPage extends Component {
  static displayName = 'RecipesPage';

  render() {
    return (
      <Page>
        <Query query={RecipesQuery}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            return data.recipes.map((recipe, i) => (
              <div key={i}>
                <h1>{recipe.title}</h1>
                <p>{recipe.description}</p>
                <Link
                  as={`/recipes/${recipe.id}`}
                  href={`/recipe?id=${recipe.id}`}
                >
                  <a>Show me more!</a>
                </Link>
              </div>
            ));
          }}
        </Query>
      </Page>
    );
  }
}
