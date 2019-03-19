import React from 'react';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { ApolloClient } from 'apollo-boost';

import UserContext from '../../utils/UserContext';
import css from './RecipeStatus.css';

export default withApollo(
  class RecipeStatus extends PureComponent {
    static displayName = 'RecipeStatus';

    static contextType = UserContext;

    static propTypes = {
      recipe: PropTypes.object,
      modification: PropTypes.object,
      unsavedCount: PropTypes.number,
      client: PropTypes.instanceOf(ApolloClient)
    };

    static defaultProps = {
      unsavedCount: 0
    };

    state = {
      isSaving: false,
      timeoutId: undefined,
      savedCount: 0
    };

    componentDidUpdate(prevProps) {
      if (prevProps.unsavedCount < this.props.unsavedCount) {
        const { timeoutId } = this.state;
        if (timeoutId !== undefined) clearTimeout(timeoutId);
        this.setState({
          timeoutId: setTimeout(() => this.saveModification(), 2000)
        });
      }
    }

    saveModification = () => {
      const { user } = this.context;
      const { recipe, modification, unsavedCount, client } = this.props;
      this.setState({ isSaving: true, timeoutId: undefined });
      client
        .mutate({
          mutation: gql`
            mutation saveModification(
              $recipe: ID!
              $user: ID!
              $sortings: [SortingInput!]!
              $alterations: [AlterationInput!]!
            ) {
              saveModification(
                recipe: $recipe
                user: $user
                sortings: $sortings
                alterations: $alterations
              ) {
                id
                sortings {
                  parentId
                  order
                }
                alterations {
                  sourceId
                  field
                }
              }
            }
          `,
          variables: {
            recipe: recipe.id,
            user: user.id,
            sortings: modification.sortings,
            alterations: modification.alterations
          }
        })
        .then(() => {
          this.setState({ isSaving: false, savedCount: unsavedCount });
        });
    };

    render() {
      const { isSaving, savedCount } = this.state;
      const { unsavedCount } = this.props;
      return (
        <div className={css.recipeStatus}>
          {!isSaving &&
            unsavedCount > savedCount &&
            `You have ${unsavedCount - savedCount} unsaved modification.`}

          {isSaving && 'Saving...'}

          {!isSaving &&
            unsavedCount === savedCount &&
            'All mods have been saved.'}
        </div>
      );
    }
  }
);
