import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useCallback
} from 'react';
import { useMutation } from 'react-apollo';
import Link from 'next/link';
import UserContext from '../../context/UserContext';
import RecipeContext from '../../context/RecipeContext';
import { setModification } from '../../actions/modification';
import { setRecipe } from '../../actions/recipe';
import SaveModificationMutation from '../../graphql/SaveModification.graphql';
import PublishRecipeMutation from '../../graphql/PublishRecipeMutation.graphql';
import css from './RecipeStatus.module.css';

const RecipeStatus = () => {
  const [saveModification, { loading: isSaving }] = useMutation(
    SaveModificationMutation
  );
  const [publishRecipe, { loading: isPublishing }] = useMutation(
    PublishRecipeMutation
  );
  const timeoutId = useRef();
  const { user } = useContext(UserContext);
  const {
    modification: { removals, sortings, alterations, additions, sessionCount },
    recipe,
    localStoreId,
    recipeDispatch,
    modificationDispatch
  } = useContext(RecipeContext);
  const [savedCount, setSavedCount] = useState(0);
  const [countDown, setCountDown] = useState(null);

  const editsCount = removals.length + sortings.length + alterations.length;

  const additionsCount = additions.length;

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
            directions: step.directions
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

  const handleRecipePublish = () => {
    publishRecipe({ variables: { recipeId: recipe.uid } }).then(({ data }) => {
      setRecipe(data.publishRecipe, recipeDispatch);
      setModification(
        {
          sortings: [],
          alterations: [],
          removals: [],
          additions: [],
          sessionCount: 0
        },
        modificationDispatch
      );
    });
  };

  const printMessage = useCallback(() => {
    // apollo save function is running
    if (isSaving) return 'Saving...';

    // Countdown to save when sessionCount increases
    if (sessionCount !== savedCount) {
      return `Saving in ${countDown} seconds `;
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
      return (
        <Link className={css.button} href="/login">
          login
        </Link>
      );
    }

    // override save countdown
    if (sessionCount !== savedCount) {
      return (
        <button onClick={handleModificationSave} className={css.button}>
          save Now
        </button>
      );
    }

    // User is the owner thus allow them to publish the recipe
    if (user.id === recipe.author.id) {
      return (
        <button
          onClick={handleRecipePublish}
          className={css.button}
          disabled={isPublishing}
        >
          publish
        </button>
      );
    }

    // User is logged in but is not the recipe owner thus encourage sharing
    return <button className={css.button}>share</button>;

    // TODO: Alow for "forking" a recipe if more than xx amount of modifications have been made
  }, [user, isSaving, sessionCount, savedCount]);

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
      {(editsCount > 0 || additionsCount > 0) && (
        <div className={css.recipeStatus}>
          <div>
            {editsCount > 0 && `Edits: ${editsCount} | `}
            {additionsCount > 0 && `Additions: ${additionsCount} | `}
            {printMessage()}
          </div>
          <div>{printButton()}</div>
        </div>
      )}
    </>
  );
};

export default RecipeStatus;
