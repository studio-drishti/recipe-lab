import React, {
  useReducer,
  useContext,
  useCallback,
  useEffect,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import UserContext from '../../context/UserContext';
import RecipeContext from '../../context/RecipeContext';
import recipeReducer from '../../reducers/recipe';
import modificationReducer from '../../reducers/modification';
import { setSorting, setModification } from '../../actions/modification';
import { getSorted, getFieldValue } from '../../utils/recipe';
import RecipeDetails from '../RecipeDetails';
import RecipePhoto from '../RecipePhoto';
import RecipeBio from '../RecipeBio';
import StepList from '../StepList';
import Step from '../Step';
import ItemList from '../ItemList';
import Item from '../Item';
import IngredientList from '../IngredientList';
import Ingredient from '../Ingredient';
import IngredientTotals from '../IngredientTotals';
import RecipeStatus from '../RecipeStatus';
import css from './Recipe.module.css';

const Recipe = props => {
  const sensorAPIRef = useRef();
  const { user } = useContext(UserContext);
  const [recipe, recipeDispatch] = useReducer(
    recipeReducer,
    props.recipe ? props.recipe : null
  );
  const [modification, modificationDispatch] = useReducer(
    modificationReducer,
    props.modification
      ? { ...props.modification, sessionCount: 0 }
      : {
          sortings: [],
          alterations: [],
          removals: [],
          additions: [],
          sessionCount: 0
        }
  );
  const localStoreId = props.recipe
    ? `MOD-${props.recipe.uid}`
    : 'MOD-NEW-RECIPE';

  useEffect(() => {
    if (localStorage.getItem(localStoreId)) {
      setModification(
        Object.assign(
          modification,
          JSON.parse(localStorage.getItem(localStoreId))
        ),
        modificationDispatch
      );
    }
  }, []);

  const onDragEnd = result => {
    // dropped outside the list or dropped in place
    if (!result.destination || result.destination.index === result.source.index)
      return;

    if (result.type.startsWith('ITEM')) {
      setSorting(
        recipe.uid,
        getUnsortedItems(),
        result.source.index,
        result.destination.index,
        modificationDispatch
      );
    } else if (result.type.startsWith('STEP')) {
      const itemId = result.destination.droppableId;
      const item = getUnsortedItems().find(item => item.uid === itemId);
      setSorting(
        itemId,
        getUnsortedSteps(item),
        result.source.index,
        result.destination.index,
        modificationDispatch
      );
    } else if (result.type.startsWith('INGREDIENT')) {
      const stepId = result.destination.droppableId;
      const step = getUnsortedItems()
        .flatMap(item => getUnsortedSteps(item))
        .find(step => step.uid === stepId);
      setSorting(
        stepId,
        getUnsortedIngredients(step),
        result.source.index,
        result.destination.index,
        modificationDispatch
      );
    }
  };

  const moveDraggable = (draggableId, direction) => {
    const api = sensorAPIRef.current;

    if (!api) return null;

    const preDrag = api.tryGetLock(draggableId);

    if (!preDrag) return;

    const drag = preDrag.snapLift();

    switch (direction) {
      case 'up':
        drag.moveUp();
        break;
      case 'down':
        drag.moveDown();
        break;
      default:
        throw new Error('Invalid drag direction');
    }

    setTimeout(() => drag.drop(), 300);
  };

  const getItems = (sorted = true) => {
    if (!recipe) return [];

    const addedItems = modification.additions.filter(
      addition => addition.parentId === recipe.uid
    );

    const items = addedItems.length
      ? recipe.items.concat(addedItems)
      : recipe.items;

    return sorted ? getSorted(items, modification.sortings, recipe.uid) : items;
  };

  const getUnsortedItems = useCallback(() => getItems(false), [
    modification.additions
  ]);

  const getSortedItems = useCallback(() => getItems(), [
    modification.additions,
    modification.sortings
  ]);

  const getSteps = (item, sorted = true) => {
    const steps = modification.additions.filter(
      addition => addition.parentId === item.uid
    );
    if ('steps' in item) steps.unshift(...item.steps);
    return sorted ? getSorted(steps, modification.sortings, item.uid) : steps;
  };

  const getUnsortedSteps = useCallback(item => getSteps(item, false), [
    modification.additions
  ]);

  const getSortedSteps = useCallback(item => getSteps(item), [
    modification.additions,
    modification.sortings
  ]);

  const getIngredients = (step, sorted = true) => {
    const ingredients = modification.additions.filter(
      addition => addition.parentId === step.uid
    );
    if ('ingredients' in step) ingredients.unshift(...step.ingredients);
    return sorted
      ? getSorted(ingredients, modification.sortings, step.uid)
      : ingredients;
  };

  const getUnsortedIngredients = useCallback(
    step => getIngredients(step, false),
    [modification.additions]
  );

  const getSortedIngredients = useCallback(step => getIngredients(step), [
    modification.additions,
    modification.sortings
  ]);

  const recipeItems = getSortedItems();

  return (
    <RecipeContext.Provider
      value={{
        localStoreId,
        recipe,
        modification,
        recipeDispatch,
        modificationDispatch
      }}
    >
      <DragDropContext
        onDragEnd={onDragEnd}
        sensors={[
          api => {
            sensorAPIRef.current = api;
          }
        ]}
      >
        <header className={css.recipeHeader}>
          <RecipePhoto
            className={css.recipePhoto}
            placeholderPhoto={props.placeholderPhoto}
          />
          <RecipeDetails className={css.recipeDetails} />
        </header>
        <div className={css.ingredientTotals}>
          {recipeItems
            .filter(item => !modification.removals.includes(item.uid))
            .map(item => (
              <div key={item.uid}>
                <h3>
                  Ingredients for{' '}
                  {getFieldValue('name', item, modification.alterations)}
                </h3>
                <IngredientTotals
                  ingredients={getSortedSteps(item)
                    .filter(step => !modification.removals.includes(step.uid))
                    .reduce((result, step) => {
                      return result.concat(
                        getSortedIngredients(step).filter(
                          ingredient =>
                            !modification.removals.includes(ingredient.uid)
                        )
                      );
                    }, [])}
                />
              </div>
            ))}
        </div>

        <article className={css.recipe}>
          <div className={css.recipeMain}>
            {recipe && (
              <ItemList recipeId={recipe.uid}>
                {recipeItems.map((item, itemI) => {
                  const itemSteps = getSortedSteps(item);
                  return (
                    <Item
                      key={item.uid}
                      item={item}
                      index={itemI}
                      isLast={itemI === recipeItems.length - 1}
                      moveDraggable={moveDraggable}
                    >
                      {itemSteps.length > 0 && (
                        <StepList itemId={item.uid}>
                          {itemSteps.map((step, stepI) => (
                            <Step
                              key={step.uid}
                              index={stepI}
                              itemId={item.uid}
                              step={step}
                            >
                              <IngredientList stepId={step.uid}>
                                {getSortedIngredients(step).map(
                                  (ingredient, i) => (
                                    <Ingredient
                                      key={ingredient.uid}
                                      index={i}
                                      ingredient={ingredient}
                                      itemId={item.uid}
                                      stepId={step.uid}
                                    />
                                  )
                                )}
                              </IngredientList>
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
        </article>
        <RecipeBio author={recipe ? recipe.author : user} />
        <RecipeStatus />
      </DragDropContext>
    </RecipeContext.Provider>
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
