import React from 'react';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { ApolloClient } from 'apollo-boost';

import UserContext from '../../utils/UserContext';
import css from './RecipeStatus.css';
import SaveModificationMutation from '../../graphql/saveModification.graphql';

export default withApollo(
  class RecipeStatus extends PureComponent {
    static displayName = 'RecipeStatus';

    static contextType = UserContext;

    static propTypes = {
      recipe: PropTypes.object,
      modification: PropTypes.object,
      unsavedCount: PropTypes.number,
      client: PropTypes.instanceOf(ApolloClient),
      updateModification: PropTypes.func
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
          mutation: SaveModificationMutation,
          variables: {
            recipe: recipe.id,
            user: user.id,
            sortings: modification.sortings.map(sorting => ({
              uid: sorting.uid,
              parentId: sorting.parentId,
              order: sorting.order
            })),
            alterations: modification.alterations.map(alteration => ({
              uid: alteration.uid,
              sourceId: alteration.sourceId,
              field: alteration.field,
              value: alteration.value
            })),
            items: modification.additions
              .filter(addition => addition.kind === 'Item')
              .map(item => ({
                uid: item.uid,
                id: item.id,
                parentId: item.parentId,
                name: item.name
              }))
          }
        })
        .then(data => {
          this.props.updateModification(
            Object.assign(modification, data.saveModification)
          );
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
