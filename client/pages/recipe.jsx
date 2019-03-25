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
    recipeId: PropTypes.string
  };

  static async getInitialProps(context) {
    const { id } = context.query;
    return {
      recipeId: id
    };
  }

  render() {
    const { user } = this.context;
    return (
      <Page>
        <Query
          query={RecipeWithModificationQuery}
          variables={{ uid: this.props.recipeId, user: user ? user.id : null }}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            const { recipe } = data;

            return (
              <>
                <Recipe recipe={recipe} />
              </>
            );
          }}
        </Query>
      </Page>
    );
  }
}
