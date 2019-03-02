import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import PropTypes from 'prop-types';

import { API_URL } from '../config';
import Page from '../layouts/Main';

export default class RecipesPage extends Component {
  static displayName = 'RecipesPage';

  static propTypes = {
    recipes: PropTypes.array
  };

  static async getInitialProps() {
    const res = await fetch(`${API_URL}/api/recipes`);
    const recipes = await res.json();

    return {
      recipes
    };
  }

  render() {
    const { recipes } = this.props;
    return (
      <Page>
        {recipes.map((recipe, i) => (
          <div key={i}>
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>
            <Link
              as={`/recipes/${recipe._id}`}
              href={`/recipe?id=${recipe._id}`}
            >
              <a>Show me more!</a>
            </Link>
          </div>
        ))}
      </Page>
    );
  }
}
