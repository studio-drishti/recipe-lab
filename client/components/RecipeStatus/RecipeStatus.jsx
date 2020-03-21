import React, { useState, useRef, useContext, useEffect } from 'react';
import { useMutation } from 'react-apollo';
import UserContext from '../../context/UserContext';
import RecipeContext from '../../context/RecipeContext';
import { setModification } from '../../actions/modification';
import css from './RecipeStatus.module.css';
import SaveModificationMutation from '../../graphql/SaveModification.graphql';

const RecipeStatus = () => {
  const [saveModification, { loading: isSaving }] = useMutation(
    SaveModificationMutation
  );
  const timeoutId = useRef();
  const { user } = useContext(UserContext);
  const {
    modification: { removals, sortings, alterations, additions, sessionCount },
    recipe,
    modificationDispatch
  } = useContext(RecipeContext);
  const [savedCount, setSavedCount] = useState(0);

  const modificationCount =
    removals.length + sortings.length + alterations.length + additions.length;

  const printMessage = () => {
    // if user not logged in. tell them to.

    if (isSaving) return 'Saving...';

    if (sessionCount !== savedCount) {
      return (
        <>
          {'Auto save in XXs'} <a href="#">Save Now</a>
        </>
      );
    }

    return 'All good!';
  };

  useEffect(() => {
    if (sessionCount) {
      if (timeoutId.current !== undefined) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => autoSaveModification(), 30000);
    }
  }, [sessionCount]);

  const autoSaveModification = () => {
    timeoutId.current = undefined;
    saveModification({
      variables: {
        recipe: recipe.uid,
        user: user.id,
        removals: removals,
        sortings: sortings.map(sorting => ({
          uid: sorting.uid,
          parentId: sorting.parentId,
          order: sorting.order
        })),
        alterations: alterations.map(alteration => ({
          uid: alteration.uid,
          sourceId: alteration.sourceId,
          field: alteration.field,
          value: alteration.value
        })),
        items: additions
          .filter(addition => addition.kind === 'Item')
          .map(item => ({
            uid: item.uid,
            parentId: item.parentId,
            name: item.name
          })),
        steps: additions
          .filter(addition => addition.kind === 'Step')
          .map(step => ({
            uid: step.uid,
            parentId: step.parentId,
            directions: step.directions,
            notes: step.notes
          })),
        ingredients: additions
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
      setModification(data.saveModification, modificationDispatch);
      setSavedCount(sessionCount);
    });
  };

  return (
    <div className={css.recipeStatus}>
      <div>
        Mods: {modificationCount}
        {' | '}
        {printMessage()}
      </div>
      <div>
        <button>Do the thing</button>
      </div>
    </div>
  );
};

export default RecipeStatus;
