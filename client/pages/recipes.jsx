import React, { Component } from 'react';
import Link from 'next/link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Page from '../layouts/Main';

const GET_RECIPES = gql`
  {
    recipes {
      id
      title
      description
    }
  }
`;

export default class RecipesPage extends Component {
  static displayName = 'RecipesPage';

  render() {
    return (
      <Page>
        <Query query={GET_RECIPES}>
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
