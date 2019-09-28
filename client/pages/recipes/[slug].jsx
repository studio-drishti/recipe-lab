import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from '../../layouts/Main';
import Recipe from '../../components/Recipe';
import RecipeWithModificationQuery from '../../graphql/RecipeWithModification.graphql';

export default class IndexPage extends Component {
  static displayName = 'IndexPage';
  static propTypes = {
    recipeSlug: PropTypes.string,
    modification: PropTypes.object,
    recipe: PropTypes.object
  };

  static async getInitialProps({ query, apolloClient }) {
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
  }

  render() {
    const { modification, recipe } = this.props;
    return (
      <Page>
        <Recipe recipe={recipe} modification={modification} />
      </Page>
    );
  }
}
