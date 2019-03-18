import React from 'react';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import UserContext from '../../utils/UserContext';

const SAVE_MODIFICATION = gql`
  mutation saveModification(
    $recipe: ID!
    $author: ID!
    $sortings: [SortingInput!]
  ) {
    saveModification(recipe: $recipe, author: $author, sortings: $sortings) {
      id
      sortings {
        parentId
        order
      }
    }
  }
`;

export default class RecipeStatus extends PureComponent {
  static displayName = 'RecipeStatus';
  static contextType = UserContext;
  static propTypes = {
    recipe: PropTypes.object,
    modification: PropTypes.object
  };

  render() {
    const { recipe, modification } = this.props;
    const { user } = this.context;
    return (
      <>
        {user && (
          <Mutation mutation={SAVE_MODIFICATION}>
            {(saveModification, { error, loading }) => (
              <button
                onClick={() =>
                  saveModification({
                    variables: {
                      recipe: recipe.id,
                      author: user.id,
                      sortings: modification.sortings
                    }
                  })
                }
              >
                {loading && 'loading...'}
                {error && 'ERR!!!'}
                {!loading && !error && 'Save modification'}
              </button>
            )}
          </Mutation>
        )}
      </>
    );
  }
}
