import React, { useState, useRef, useContext, useEffect } from 'react';
import { useMutation } from 'react-apollo';
import UserContext from '../../context/UserContext';
import RecipeContext from '../../context/RecipeContext';
import { setModification } from '../../actions/modification';
import css from './RecipeStatus.css';
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
  const [countDown, setCountDown] = useState(null);
  const modificationCount =
    removals.length + sortings.length + alterations.length + additions.length;

  const printMessage = () => {
    // if user not logged in. tell them to.
    if (!user) {
      return 'Please log in to save your changes';
    }

    if (isSaving) return 'Saving...';

    if (sessionCount !== savedCount) {
      return (
        <>
          {`Saving in ${countDown} seconds | `}
          <a href="#" onClick={saveModifications}>
            Save Now
          </a>
        </>
      );
    }

    return 'All good!';
  };

  const saveModifications = e => {
    if (e) e.preventDefault();
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

  //Each case will render a different button
  const printButton = () => {
    if (!user) {
      return <a href="/register">Login</a>;
    }

    //If the user is the owner, allow them to publish the recipe
    if (user.id === recipe.author.id) {
      //publish doesn't exist yet, we have to write logic for that.
      return <button>Publish</button>;
    }
    return <button>Not owner ???</button>; //Default behavior TBD
    //What do do if the user is logged in, but not the recipe owner? - Open question to consider
    //Can they just save modifications to their account without publishing? Still share link?
  };

  useEffect(() => {
    if (!user) return;
    if (countDown === null) return;
    if (timeoutId.current) clearTimeout(timeoutId.current);
    if (countDown > 0) {
      timeoutId.current = setTimeout(() => setCountDown(countDown - 1), 1000);
    } else {
      timeoutId.current = null;
      saveModifications();
    }
  }, [countDown]);

  useEffect(() => {
    if (sessionCount) {
      setCountDown(6);
    }
  }, [sessionCount]);

  //TODO - Use react spring to animate this status in
  return (
    <>
      {modificationCount > 0 && (
        <div className={css.recipeStatus}>
          <div>
            Mods: {modificationCount}
            {' | '}
            {printMessage()}
          </div>
          <div>{printButton()}</div>
        </div>
      )}
    </>
  );
};

export default RecipeStatus;
