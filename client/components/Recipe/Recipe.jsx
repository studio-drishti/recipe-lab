import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import cuid from 'cuid';

import reorder from '../../utils/reorder';
import areArraysEqual from '../../utils/areArraysEqual';
import UserContext from '../../utils/UserContext';

import RecipeDetails from '../RecipeDetails';
import RecipePhoto from '../RecipePhoto/RecipePhoto';
import RecipeBio from '../RecipeBio';
import StepList from '../StepList';
import Step from '../Step';
import ItemList from '../ItemList';
import Item from '../Item';
import IngredientList from '../IngredientList';
import Ingredient from '../Ingredient';
import IngredientTotals from '../IngredientTotals';
import RecipeStatus from '../RecipeStatus';

import css from './Recipe.css';

const Recipe = props => {
  const { user } = useContext(UserContext);
  const [state, setState] = useState({
    unsavedCount: 0,
    localStoreId: props.recipe ? `MOD-${props.recipe.uid}` : 'MOD-NEW-RECIPE',
    recipe: props.recipe ? props.recipe : null,
    modification: props.modification
      ? props.modification
      : {
          sortings: [],
          alterations: [],
          removals: [],
          additions: []
        }
  });

  // TODO: useEffect refactor
  // componentDidMount() {
  //   let { modification } = state;
  //   if (localStorage.getItem(localStoreId)) {
  //     modification = Object.assign(
  //       modification,
  //       JSON.parse(localStorage.getItem(localStoreId))
  //     );
  //   }
  //   setState({ modification });
  // }

  const setModification = modification => {
    const { localStoreId } = state;
    let { unsavedCount } = state;
    unsavedCount++;
    localStorage.setItem(localStoreId, JSON.stringify(modification));
    setState({ ...state, modification, unsavedCount });
  };

  const saveAlteration = (source, field, value) => {
    const { modification } = state;
    const alterationIndex = modification.alterations.findIndex(
      alteration =>
        alteration.field === field && alteration.sourceId === source.uid
    );
    const alterationExists = alterationIndex > -1;

    if (!alterationExists && source[field] === value) return;

    if (alterationExists && source[field] === value) {
      // Remove exisitng alteration if the new value is the same as the source
      modification.alterations.splice(alterationIndex, 1);
    } else if (alterationExists) {
      // Update existing alteration
      modification.alterations[alterationIndex].value = value;
    } else {
      // Add new alteration
      modification.alterations.push({
        uid: cuid(),
        sourceId: source.uid,
        field,
        value
      });
    }

    setModification(modification);
  };

  const updateAddition = (source, field, value) => {
    const { modification } = state;

    const index = modification.additions.findIndex(
      addition => addition.uid === source.uid
    );

    if (index === -1) return;

    modification.additions[index][field] = value;

    setModification(modification);
  };

  const saveOrUpdateField = (source, fieldName, value) => {
    if ('kind' in source) {
      updateAddition(source, fieldName, value);
    } else {
      saveAlteration(source, fieldName, value);
    }
  };

  const saveRemoval = source => {
    const { modification } = state;

    // source was already removed
    if (modification.removals.includes(source.uid)) return;

    modification.removals.push(source.uid);

    // Clear any saved alterations for the deleted ingredient
    modification.alterations = modification.alterations.filter(
      mod => mod.sourceId !== source.uid
    );

    setModification(modification);
  };

  const deleteAdditions = (...sources) => {
    const { modification } = state;
    sources.forEach(source => {
      const index = modification.additions.findIndex(
        addition => addition.uid === source.uid
      );
      modification.additions.splice(index, 1);
    });
    setModification(modification);
  };

  const removeIngredient = ingredient => {
    if ('kind' in ingredient) {
      deleteAdditions(ingredient);
    } else {
      saveRemoval(ingredient);
    }
  };

  const removeStep = step => {
    if ('kind' in step) {
      deleteAdditions(step, ...getUnsortedIngredients(step));
    } else {
      saveRemoval(step);
    }
  };

  const removeItem = item => {
    if ('kind' in item) {
      const steps = getUnsortedSteps(item);
      const ingredients = steps.reduce((result, step) => {
        const stepIngredients = getUnsortedIngredients(step);
        if (stepIngredients.length) result.push(...stepIngredients);
        return result;
      }, []);
      deleteAdditions(item, ...steps, ...ingredients);
    } else {
      saveRemoval(item);
    }
  };

  const undoRemoval = source => {
    const { modification } = state;
    const removalIndex = modification.removals.indexOf(source.uid);

    if (removalIndex === -1) return;

    modification.removals.splice(removalIndex, 1);

    setModification(modification);
  };

  const undoAnyRemovals = (...sources) => {
    sources.forEach(source => undoRemoval(source));
  };

  const saveSorting = (parentId, unsorted, sourceI, destinationI) => {
    const { modification } = state;
    const sortingIndex = modification.sortings.findIndex(
      sorting => sorting.parentId === parentId
    );
    const sortingExists = sortingIndex > -1;
    const sorted = sortingExists ? getSorted(parentId, unsorted) : unsorted;

    const order = reorder(sorted, sourceI, destinationI).map(
      child => child.uid
    );

    if (
      sortingExists &&
      areArraysEqual(order, unsorted.map(child => child.uid))
    ) {
      // Remove existing sorting if the new value is the same as the source
      modification.sortings.splice(sortingIndex, 1);
    } else if (sortingExists) {
      // Update existing sorting
      modification.sortings[sortingIndex].order = order;
    } else {
      // Add new sorting
      modification.sortings.push({
        uid: cuid(),
        parentId,
        order
      });
    }

    setModification(modification);
  };

  const onDragEnd = result => {
    // dropped outside the list or dropped in place
    if (!result.destination || result.destination.index === result.source.index)
      return;

    const { recipe } = state;

    if (result.type.startsWith('ITEM')) {
      saveSorting(
        recipe.uid,
        getUnsortedItems(),
        result.source.index,
        result.destination.index
      );
    } else if (result.type.startsWith('STEP')) {
      const itemId = result.destination.droppableId;
      const item = getUnsortedItems().find(item => item.uid === itemId);
      saveSorting(
        itemId,
        getUnsortedSteps(item),
        result.source.index,
        result.destination.index
      );
    } else if (result.type.startsWith('INGREDIENT')) {
      const stepId = result.destination.droppableId;
      const step = getUnsortedItems()
        .flatMap(item => getUnsortedSteps(item))
        .find(step => step.uid === stepId);
      saveSorting(
        stepId,
        getUnsortedIngredients(step),
        result.source.index,
        result.destination.index
      );
    }
  };

  const createItem = () => {
    const { recipe, modification } = state;

    const addition = {
      uid: cuid(),
      kind: 'Item',
      parentId: recipe.uid,
      name: '',
      processing: ''
    };

    modification.additions.push(addition);
    setModification(modification);
  };

  const createStep = itemId => {
    const { modification } = state;

    const addition = {
      uid: cuid(),
      kind: 'Step',
      parentId: itemId,
      directions: '',
      notes: ''
    };

    modification.additions.push(addition);
    setModification(modification);
  };

  const createIngredient = stepId => {
    const { modification } = state;

    const addition = {
      uid: cuid(),
      kind: 'Ingredient',
      parentId: stepId,
      quantity: '',
      unit: '',
      name: '',
      processing: ''
    };

    modification.additions.push(addition);

    setModification(modification);
    setState({ ...state, activeIngredient: addition });
  };

  const getSorted = (parentId, arr) => {
    const { modification } = state;
    const sortMod = modification.sortings.find(
      mod => mod.parentId === parentId
    );

    if (sortMod === undefined) return arr;

    return [...arr].sort((a, b) => {
      const indexA = sortMod.order.indexOf(a.uid);
      const indexB = sortMod.order.indexOf(b.uid);
      if (indexB === -1) return 0;
      return indexA > indexB;
    });
  };

  const getItems = (sorted = true) => {
    const { recipe, modification } = state;

    if (!recipe) return [];

    const addedItems = modification.additions.filter(
      addition => addition.parentId === recipe.uid
    );

    const items = addedItems.length
      ? recipe.items.concat(addedItems)
      : recipe.items;

    return sorted ? getSorted(recipe.uid, items) : items;
  };

  const getUnsortedItems = () => {
    return getItems(false);
  };

  const getSteps = (item, sorted = true) => {
    const { modification } = state;
    const steps = modification.additions.filter(
      addition => addition.parentId === item.uid
    );
    if ('steps' in item) steps.unshift(...item.steps);
    return sorted ? getSorted(item.uid, steps) : steps;
  };

  const getUnsortedSteps = item => {
    return getSteps(item, false);
  };

  const getIngredients = (step, sorted = true) => {
    const { modification } = state;
    const ingredients = modification.additions.filter(
      addition => addition.parentId === step.uid
    );
    if ('ingredients' in step) ingredients.unshift(...step.ingredients);
    return sorted ? getSorted(step.uid, ingredients) : ingredients;
  };

  const getUnsortedIngredients = step => {
    return getIngredients(step, false);
  };

  const getAlteration = (source, fieldName) => {
    const { modification } = state;
    const mod = modification.alterations.find(
      mod => mod.sourceId === source.uid && mod.field === fieldName
    );
    return mod ? mod.value : undefined;
  };

  const getFieldValue = (source, fieldName) => {
    const mod = getAlteration(source, fieldName);
    return mod !== undefined ? mod : source[fieldName];
  };

  const setRecipePhoto = photo => {
    const { recipe } = state;
    setState({ ...state, recipe: { ...recipe, photo } });
  };

  const { recipe, modification, unsavedCount } = state;
  const recipeItems = getItems();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <header className={css.recipeHeader}>
        <RecipeDetails
          className={css.recipeDetails}
          recipe={recipe}
          recipeMods={modification.alterations.filter(
            alteration => alteration.sourceId === recipe.uid
          )}
          saveAlteration={saveAlteration}
          setRecipePhoto={setRecipePhoto}
        />
        <RecipePhoto
          className={css.recipePhoto}
          placeholderPhoto={props.placeholderPhoto}
          setRecipePhoto={setRecipePhoto}
          recipe={recipe}
        />
      </header>

      <article className={css.recipe}>
        <div className={css.recipeMain}>
          {recipe && (
            <ItemList recipeId={recipe.uid}>
              {recipeItems.map((item, itemI) => {
                const itemSteps = getSteps(item);
                return (
                  <Item
                    key={item.uid}
                    item={item}
                    itemMods={modification.alterations.filter(
                      mod => mod.sourceId === item.uid
                    )}
                    index={itemI}
                    isLast={itemI === recipeItems.length - 1}
                    removed={modification.removals.includes(item.uid)}
                    removeItem={() => removeItem(item)}
                    restoreItem={() => undoRemoval(item)}
                    createStep={() => createStep(item.uid)}
                    createItem={createItem}
                    saveOrUpdateField={saveOrUpdateField}
                  >
                    {itemSteps.length > 0 && (
                      <StepList itemId={item.uid}>
                        {itemSteps.map((step, stepI) => (
                          <Step
                            key={step.uid}
                            index={stepI}
                            itemId={item.uid}
                            step={step}
                            stepMods={modification.alterations.filter(
                              mod => mod.sourceId === step.uid
                            )}
                            removed={modification.removals.some(sourceId =>
                              [item.uid, step.uid].includes(sourceId)
                            )}
                            saveOrUpdateField={saveOrUpdateField}
                            removeStep={() => removeStep(step)}
                            restoreStep={() => undoAnyRemovals(item, step)}
                            createIngredient={() => createIngredient(step.uid)}
                          >
                            {({ isActive }) => (
                              <>
                                {isActive && (
                                  <IngredientList stepId={step.uid}>
                                    {getIngredients(step).map(
                                      (ingredient, i) => (
                                        <Ingredient
                                          key={ingredient.uid}
                                          index={i}
                                          ingredient={ingredient}
                                          ingredientMods={modification.alterations.filter(
                                            mod =>
                                              mod.sourceId === ingredient.uid
                                          )}
                                          removed={modification.removals.some(
                                            sourceId =>
                                              [
                                                item.uid,
                                                step.uid,
                                                ingredient.uid
                                              ].includes(sourceId)
                                          )}
                                          removeIngredient={() =>
                                            removeIngredient(ingredient)
                                          }
                                          restoreIngredient={() =>
                                            undoAnyRemovals(
                                              item,
                                              step,
                                              ingredient
                                            )
                                          }
                                          saveOrUpdateField={saveOrUpdateField}
                                        />
                                      )
                                    )}
                                  </IngredientList>
                                )}
                              </>
                            )}
                          </Step>
                        ))}
                      </StepList>
                    )}
                  </Item>
                );
              })}
            </ItemList>
          )}

          {!recipe && <p>you gotta finish creating your recipe, dude!</p>}
        </div>
        <aside className={css.stepDetail}>
          <div className={css.sticky}>
            <RecipeStatus
              recipe={recipe}
              modification={modification}
              unsavedCount={unsavedCount}
              updateModification={modification =>
                setState({ ...state, modification })
              }
            />
            <div className={css.ingredientTotals}>
              {recipeItems
                .filter(item => !modification.removals.includes(item.uid))
                .map(item => (
                  <div key={item.uid}>
                    <h3>Ingredients for {getFieldValue(item, 'name')}</h3>
                    <IngredientTotals
                      ingredients={getSteps(item)
                        .filter(
                          step => !modification.removals.includes(step.uid)
                        )
                        .reduce((result, step) => {
                          return result.concat(
                            getIngredients(step).filter(
                              ingredient =>
                                !modification.removals.includes(ingredient.uid)
                            )
                          );
                        }, [])}
                      removals={modification.removals}
                      alterations={modification.alterations}
                    />
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </article>
      <RecipeBio author={recipe ? recipe.author : user} />
    </DragDropContext>
  );
};

Recipe.propTypes = {
  recipe: PropTypes.shape({
    uid: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.object,
    time: PropTypes.string,
    skill: PropTypes.string,
    description: PropTypes.string,
    servingAmount: PropTypes.string,
    servingType: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    photo: PropTypes.string
  }),
  modification: PropTypes.object,
  placeholderPhoto: PropTypes.string
};

export default Recipe;
