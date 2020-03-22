import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useCallback
} from 'react';
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
    localStoreId,
    modificationDispatch
  } = useContext(RecipeContext);
  const [savedCount, setSavedCount] = useState(0);
  const [countDown, setCountDown] = useState(null);
  const modificationCount =
    removals.length + sortings.length + alterations.length + additions.length;

  const handleModificationSave = e => {
    if (e) e.preventDefault();
    if (user) {
      uploadModifications();
    } else {
      stashModifications();
    }
  };

  const uploadModifications = () => {
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

  const stashModifications = () => {
    localStorage.setItem(
      localStoreId,
      JSON.stringify({
        sortings,
        alterations,
        removals,
        additions
      })
    );
    setSavedCount(sessionCount);
  };

  const printMessage = useCallback(() => {
    // apollo save function is running
    if (isSaving) return 'Saving...';

    // Countdown to save when sessionCount increases
    if (sessionCount !== savedCount) {
      return (
        <>
          {`Saving in ${countDown} seconds `}
          <small>
            [
            <a href="#" onClick={handleModificationSave}>
              Save Now
            </a>
            ]
          </small>
        </>
      );
    }

    // User not logged in thus tell them to do so.
    if (!user) {
      return 'Your edits are stashed in the browser. Please login to save permanently.';
    }

    // User is logged in and all mods are saved.
    return 'All good!';
  }, [user, isSaving, sessionCount, savedCount, countDown]);

  const printButton = useCallback(() => {
    // User is not logged in thus prompt for login
    if (!user) {
      return <button>Login</button>;
    }

    // User is the owner thus allow them to publish the recipe
    if (user.id === recipe.author.id) {
      return <button>Publish</button>;
    }

    // User is logged in but is not the recipe owner thus encourage sharing
    return <button>Share</button>;

    // TODO: Alow for "forking" a recipe if more than xx amount of modifications have been made
  }, [user]);

  useEffect(() => {
    if (countDown === null) return;
    if (timeoutId.current) clearTimeout(timeoutId.current);
    if (countDown > 0) {
      timeoutId.current = setTimeout(() => setCountDown(countDown - 1), 1000);
    } else {
      timeoutId.current = null;
      handleModificationSave();
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
            {'Edits: '}
            {modificationCount}
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
