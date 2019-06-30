import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import UserContext from '../utils/UserContext';
import Page from '../layouts/Main';
import Recipe from '../components/Recipe';
import RecipeWithModificationQuery from '../graphql/RecipeWithModification.graphql';

export default class IndexPage extends Component {
  static displayName = 'IndexPage';
  static contextType = UserContext;
  static propTypes = {
    recipeSlug: PropTypes.string
  };

  static async getInitialProps(context) {
    const { slug } = context.query;
    return {
      recipeSlug: slug
    };
  }

  render() {
    const { user } = this.context;
    const { recipeSlug } = this.props;
    return (
      <Page>
        <Query
          query={RecipeWithModificationQuery}
          variables={{ slug: recipeSlug, user: user ? user.id : null }}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            const { recipe: recipeWithMod } = data;
            const { modification, ...recipe } = recipeWithMod;
            return (
              <>
                <Recipe recipe={recipe} modification={modification} />
              </>
            );
          }}
        </Query>
      </Page>
    );
  }
}
