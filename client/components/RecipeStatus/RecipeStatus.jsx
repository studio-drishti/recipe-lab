import React, { useState, useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';

import UserContext from '../../utils/UserContext';
import css from './RecipeStatus.css';
import SaveModificationMutation from '../../graphql/SaveModification.graphql';

const RecipeStatus = ({
  recipe,
  modification,
  unsavedCount,
  updateModification
}) => {
  const [saveModification, { loading: isSaving }] = useMutation(
    SaveModificationMutation
  );
  const timeoutId = useRef();
  const { user } = useContext(UserContext);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (unsavedCount) {
      if (timeoutId.current !== undefined) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => autoSaveModification(), 2000);
    }
  }, [unsavedCount]);

  const autoSaveModification = () => {
    timeoutId.current = undefined;
    saveModification({
      variables: {
        recipe: recipe.uid,
        user: user.id,
        removals: modification.removals,
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
            parentId: item.parentId,
            name: item.name
          })),
        steps: modification.additions
          .filter(addition => addition.kind === 'Step')
          .map(step => ({
            uid: step.uid,
            parentId: step.parentId,
            directions: step.directions,
            notes: step.notes
          })),
        ingredients: modification.additions
          .filter(addition => addition.kind === 'Ingredient')
          .map(ingredient => ({
            uid: ingredient.uid,
            parentId: ingredient.parentId,
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            processing: ingredient.processing
          }))
      }
    }).then(data => {
      updateModification(Object.assign(modification, data.saveModification));
      setSavedCount(unsavedCount);
    });
  };

  return (
    <div className={css.recipeStatus}>
      {!isSaving &&
        unsavedCount > savedCount &&
        `You have ${unsavedCount - savedCount} unsaved modification.`}

      {isSaving && 'Saving...'}

      {!isSaving && unsavedCount === savedCount && 'All mods have been saved.'}
    </div>
  );
};

RecipeStatus.propTypes = {
  recipe: PropTypes.object,
  modification: PropTypes.object,
  unsavedCount: PropTypes.number,
  updateModification: PropTypes.func
};

export default RecipeStatus;
