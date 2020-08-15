import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import UserContext from '../../context/UserContext';
import SaveModificationMutation from '../../graphql/SaveModificationMutation.graphql';
import css from './ConflictResolution.module.css';

const ConflictResolution = ({ recipes }) => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [resolved, setResolved] = useState([]);
  const [saveModification, { loading: isSaving }] = useMutation(
    SaveModificationMutation
  );

  const listModifications = ({
    sortings,
    alterations,
    removals,
    additions,
  }) => (
    <ul>
      {sortings.length > 0 && <li>Sorting adjustments: {sortings.length}</li>}
      {alterations.length > 0 && <li>Alterations: {alterations.length}</li>}
      {removals.length > 0 && <li>Removals: {removals.length}</li>}
      {additions.length > 0 && <li>Additions: {additions.length}</li>}
    </ul>
  );

  const redirect = () => {
    if (router.query.returnTo) {
      router.replace('/recipes/[slug]', `/recipes/${router.query.returnTo}`);
    } else {
      router.replace('/chef/[slug]', `/chef/${user.slug}`);
    }
  };

  const preferOnlineMod = (recipeId) => {
    setResolved([...resolved, recipeId]);
    localStorage.removeItem(`MOD-${recipeId}`);
  };

  const preferOfflineMod = (recipe) => {
    const { alterations, additions, removals, sortings } = JSON.parse(
      localStorage.getItem(`MOD-${recipe.uid}`)
    );
    saveModification({
      variables: {
        recipeId: recipe.uid,
        userId: user.id,
        removals,
        sortings,
        alterations,
        items: additions
          .filter((addition) => addition.kind === 'Item')
          .map(({ kind, ...item }) => item),
        steps: additions
          .filter((addition) => addition.kind === 'Step')
          .map(({ kind, ...step }) => step),
        ingredients: additions
          .filter((addition) => addition.kind === 'Ingredient')
          .map(({ kind, ...ingredient }) => ingredient),
      },
    }).then(() => {
      setResolved([...resolved, recipe.uid]);
      localStorage.removeItem(`MOD-${recipe.uid}`);
    });
  };

  useEffect(() => {
    if (resolved.length === recipes.length) {
      redirect();
    }
  }, [resolved]);

  return (
    <div>
      <h1>Conflicts Detected</h1>
      <p>
        Some recipe modifications you made offline conflict with the
        modifications saved to your account. Please choose how to handle the
        confilcts below. NOTE: We'll prefer modifications saved to your account
        over those in your browser if you do not make a selection.
      </p>

      <div className={css.conflicts}>
        {recipes
          .filter((recipe) => !resolved.includes(recipe.uid))
          .map((recipe) => (
            <div className={css.conflict} key={recipe.uid}>
              <h2>{recipe.title}</h2>
              <div className={css.conflictDetails}>
                <div>
                  <h3>Online</h3>
                  {listModifications(recipe.modification)}
                  <button onClick={preferOnlineMod}>
                    Use online modification
                  </button>
                </div>
                <div>
                  <h3>Offline</h3>
                  {listModifications(
                    JSON.parse(localStorage.getItem(`MOD-${recipe.uid}`))
                  )}
                  <button onClick={() => preferOfflineMod(recipe)}>
                    Use offline modification
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <button onClick={redirect}>I don't care</button>
    </div>
  );
};

ConflictResolution.propTypes = {
  recipes: PropTypes.array,
};

export default ConflictResolution;
