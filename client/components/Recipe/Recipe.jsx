import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import cuid from 'cuid';

import css from './Recipe.css';

import reorder from '../../utils/reorder';
import areArraysEqual from '../../utils/areArraysEqual';

import RecipeDetails from '../RecipeDetails';
import RecipeCarousel from '../RecipeCarousel/RecipeCarousel';
import RecipeBio from '../RecipeBio';
import StepList from '../StepList';
import Step from '../Step';
import ItemList from '../ItemList';
import Item from '../Item';
import ItemName from '../ItemName';
import IngredientList from '../IngredientList';
import Ingredient from '../Ingredient';
import IngredientTotals from '../IngredientTotals';
import StepHeader from '../StepHeader';
import RecipeNav from '../RecipeNav';
import Directions from '../Directions';
import RecipeStatus from '../RecipeStatus';

export default class Recipe extends Component {
  static displayName = 'Recipe';

  static propTypes = {
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
      photos: PropTypes.arrayOf(PropTypes.object)
    })
  };

  state = {
    recipe: this.props.recipe,
    activeItem: this.props.recipe.items[0],
    activeStep: this.props.recipe.items[0].steps[0],
    activeIngredient: null,
    autoFocusId: null,
    localStoreId: `MOD-${this.props.recipe.uid}`,
    unsavedCount: 0,
    modification: {
      sortings: [],
      alterations: [],
      removals: [],
      additions: []
    }
  };

  componentDidMount() {
    // const { localStoreId } = this.state;
    let { modification, recipe } = this.state;

    if (recipe.modification) {
      modification = Object.assign(modification, recipe.modification);
    }

    // if (localStorage.getItem(localStoreId)) {
    //   modification = Object.assign(
    //     modification,
    //     JSON.parse(localStorage.getItem(localStoreId))
    //   );
    // }

    this.setState({ modification });
  }

  setActiveStep = (item, step) => {
    this.setState({
      activeItem: item,
      activeStep: step
    });
  };

  setActiveIngredient = ingredient => {
    this.setState({ activeIngredient: ingredient });
  };

  setModification = modification => {
    const { localStoreId } = this.state;
    let { unsavedCount } = this.state;
    unsavedCount++;
    localStorage.setItem(localStoreId, JSON.stringify(modification));
    this.setState({ modification, unsavedCount });
  };

  saveAlteration = (source, field, value) => {
    const { modification } = this.state;
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

    this.setModification(modification);
  };

  updateAddition = (source, field, value) => {
    const { modification } = this.state;

    const index = modification.additions.findIndex(
      addition => addition.uid === source.uid
    );

    if (index === -1) return;

    modification.additions[index][field] = value;

    this.setModification(modification);
  };

  saveOrUpdateField = (source, fieldName, value) => {
    if ('kind' in source) {
      this.updateAddition(source, fieldName, value);
    } else {
      this.saveAlteration(source, fieldName, value);
    }
  };

  saveRemoval = source => {
    const { modification } = this.state;

    // source was already removed
    if (modification.removals.includes(source.uid)) return;

    modification.removals.push(source.uid);

    // Clear any saved alterations for the deleted ingredient
    modification.alterations = modification.alterations.filter(
      mod => mod.sourceId !== source.uid
    );

    this.setModification(modification);
  };

  deleteAdditions = (...sources) => {
    const { modification } = this.state;
    sources.forEach(source => {
      const index = modification.additions.findIndex(
        addition => addition.uid === source.uid
      );
      modification.additions.splice(index, 1);
    });
    this.setModification(modification);
  };

  removeIngredient = ingredient => {
    if ('kind' in ingredient) {
      this.deleteAdditions(ingredient);
    } else {
      this.saveRemoval(ingredient);
    }
  };

  removeStep = step => {
    if ('kind' in step) {
      this.deleteAdditions(step, ...this.getUnsortedIngredients(step));
    } else {
      this.saveRemoval(step);
    }
  };

  removeItem = item => {
    if ('kind' in item) {
      const steps = this.getUnsortedSteps(item);
      const ingredients = steps.reduce((result, step) => {
        const stepIngredients = this.getUnsortedIngredients(step);
        if (stepIngredients.length) result.push(...stepIngredients);
        return result;
      }, []);
      this.deleteAdditions(item, ...steps, ...ingredients);
    } else {
      this.saveRemoval(item);
    }
  };

  undoRemoval = source => {
    const { modification } = this.state;
    const removalIndex = modification.removals.indexOf(source.uid);

    if (removalIndex === -1) return;

    modification.removals.splice(removalIndex, 1);

    this.setModification(modification);
  };

  undoAnyRemovals = (...sources) => {
    sources.forEach(source => this.undoRemoval(source));
  };

  saveSorting = (parentId, unsorted, sourceI, destinationI) => {
    const { modification } = this.state;
    const sortingIndex = modification.sortings.findIndex(
      sorting => sorting.parentId === parentId
    );
    const sortingExists = sortingIndex > -1;
    const sorted = sortingExists
      ? this.getSorted(parentId, unsorted)
      : unsorted;

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

    this.setModification(modification);
  };

  onDragEnd = result => {
    // dropped outside the list or dropped in place
    if (!result.destination || result.destination.index === result.source.index)
      return;

    const { recipe } = this.state;

    if (result.type.startsWith('ITEM')) {
      this.saveSorting(
        recipe.uid,
        this.getUnsortedItems(),
        result.source.index,
        result.destination.index
      );
    } else if (result.type.startsWith('STEP')) {
      const itemId = result.destination.droppableId;
      const item = recipe.items.find(item => item.uid === itemId);
      this.saveSorting(
        itemId,
        this.getUnsortedSteps(item),
        result.source.index,
        result.destination.index
      );
    }
  };

  createItem = () => {
    const { recipe, modification } = this.state;

    const addition = {
      uid: cuid(),
      kind: 'Item',
      parentId: recipe.uid,
      name: '',
      processing: ''
    };

    modification.additions.push(addition);

    this.setState({ autoFocusId: addition.uid });
    this.setModification(modification);
  };

  createStep = itemId => {
    const { modification } = this.state;

    const addition = {
      uid: cuid(),
      kind: 'Step',
      parentId: itemId,
      directions: '',
      notes: ''
    };

    modification.additions.push(addition);

    this.setState({ autoFocusId: addition.uid });
    this.setModification(modification);
  };

  createIngredient = async stepId => {
    const { modification } = this.state;

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

    await this.setModification(modification);
    setTimeout(() => {
      this.setState({ activeIngredient: addition });
    }, 200);
  };

  getSorted = (parentId, arr) => {
    const { modification } = this.state;
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

  getItems = (sorted = true) => {
    const { recipe, modification } = this.state;
    const addedItems = modification.additions.filter(
      addition => addition.parentId === recipe.uid
    );
    const items = addedItems.length
      ? recipe.items.concat(addedItems)
      : recipe.items;
    return sorted ? this.getSorted(recipe.uid, items) : items;
  };

  getUnsortedItems = () => {
    return this.getItems(false);
  };

  getSteps = (item, sorted = true) => {
    const { modification } = this.state;
    const steps = modification.additions.filter(
      addition => addition.parentId === item.uid
    );
    if ('steps' in item) steps.unshift(...item.steps);
    return sorted ? this.getSorted(item.uid, steps) : steps;
  };

  getUnsortedSteps = item => {
    return this.getSteps(item, false);
  };

  getIngredients = (step, sorted = true) => {
    const { modification } = this.state;
    const ingredients = modification.additions.filter(
      addition => addition.parentId === step.uid
    );
    if ('ingredients' in step) ingredients.unshift(...step.ingredients);
    return sorted ? this.getSorted(step.uid, ingredients) : ingredients;
  };

  getUnsortedIngredients = step => {
    return this.getIngredients(step, false);
  };

  getAlteration = (source, fieldName) => {
    const { modification } = this.state;
    const mod = modification.alterations.find(
      mod => mod.sourceId === source.uid && mod.field === fieldName
    );
    return mod ? mod.value : undefined;
  };

  getFieldValue = (source, fieldName) => {
    const mod = this.getAlteration(source, fieldName);
    return mod !== undefined ? mod : source[fieldName];
  };

  getActiveStepNumber = () => {
    const { activeItem, activeStep } = this.state;
    return (
      this.getSteps(activeItem).findIndex(step => step.uid === activeStep.uid) +
      1
    );
  };

  addPhoto = photo => {
    const { recipe } = this.state;
    recipe.photos.push(photo);
    this.setState({ recipe });
  };

  removePhoto = index => {
    const { recipe } = this.state;
    recipe.photos.splice(index, 1);
    this.setState({ recipe });
  };

  render() {
    const {
      recipe,
      activeItem,
      activeStep,
      activeIngredient,
      autoFocusId,
      modification,
      unsavedCount
    } = this.state;

    const recipeItems = this.getItems();
    const activeStepIngredients = this.getIngredients(activeStep);

    return (
      <>
        <header className={css.recipeHeader}>
          <RecipeDetails
            className={css.recipeDetails}
            recipe={recipe}
            recipeMods={modification.alterations.filter(
              alteration => alteration.sourceId === recipe.uid
            )}
            saveAlteration={this.saveAlteration}
            addPhoto={this.addPhoto}
          />
          <RecipeCarousel
            className={css.recipeCarousel}
            removePhoto={this.removePhoto}
            photos={[...recipe.photos]}
          />
        </header>

        <RecipeStatus
          recipe={recipe}
          modification={modification}
          unsavedCount={unsavedCount}
          updateModification={modification => this.setState({ modification })}
        />
        <article className={css.recipe}>
          <div className={css.recipeMain}>
            <div className={css.ingredientTotals}>
              {recipeItems
                .filter(item => !modification.removals.includes(item.uid))
                .map(item => (
                  <div key={item.uid}>
                    <h3>Ingredients for {this.getFieldValue(item, 'name')}</h3>
                    <IngredientTotals
                      ingredients={this.getSteps(item)
                        .filter(
                          step => !modification.removals.includes(step.uid)
                        )
                        .reduce((result, step) => {
                          return result.concat(
                            this.getIngredients(step).filter(
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

            <DragDropContext onDragEnd={this.onDragEnd}>
              <ItemList recipeId={recipe.uid}>
                {recipeItems.map((item, itemI) => {
                  const itemSteps = this.getSteps(item);
                  return (
                    <Item
                      key={item.uid}
                      itemId={item.uid}
                      index={itemI}
                      isLast={itemI === recipeItems.length - 1}
                      focusOnMount={autoFocusId === item.uid}
                      removed={modification.removals.includes(item.uid)}
                      removeItem={() => this.removeItem(item)}
                      restoreItem={() => this.undoRemoval(item)}
                      createStep={() => this.createStep(item.uid)}
                      createItem={this.createItem}
                      itemNameValue={this.getFieldValue(item, 'name')}
                      itemName={
                        <ItemName
                          item={item}
                          prefix="Directions for"
                          mod={this.getAlteration(item, 'name')}
                          saveOrUpdateField={this.saveOrUpdateField}
                        />
                      }
                    >
                      {itemSteps.length > 0 && (
                        <StepList itemId={item.uid}>
                          {itemSteps.map((step, stepI) => (
                            <Step
                              key={step.uid}
                              index={stepI}
                              itemId={item.uid}
                              stepId={step.uid}
                              directionsValue={this.getFieldValue(
                                step,
                                'directions'
                              )}
                              removed={modification.removals.some(sourceId =>
                                [item.uid, step.uid].includes(sourceId)
                              )}
                              isActive={
                                activeItem.uid === item.uid &&
                                activeStep.uid === step.uid
                              }
                              focusOnMount={autoFocusId === step.uid}
                              activateStep={() =>
                                this.setActiveStep(item, step)
                              }
                              removeStep={() => this.removeStep(step)}
                              restoreStep={() =>
                                this.undoAnyRemovals(item, step)
                              }
                              directions={
                                <Directions
                                  step={step}
                                  mod={this.getAlteration(step, 'directions')}
                                  saveOrUpdateField={this.saveOrUpdateField}
                                />
                              }
                            />
                          ))}
                        </StepList>
                      )}
                    </Item>
                  );
                })}
              </ItemList>
            </DragDropContext>
          </div>
          <aside className={css.stepDetail}>
            <div className={css.sticky}>
              <StepHeader
                activeStep={activeStep}
                removed={modification.removals.some(sourceId =>
                  [activeItem.uid, activeStep.uid].includes(sourceId)
                )}
                removeStep={() => this.saveRemoval(activeStep)}
                restoreStep={() => this.undoAnyRemovals(activeItem, activeStep)}
                itemName={
                  <ItemName
                    item={activeItem}
                    removed={modification.removals.includes(activeItem.uid)}
                    restoreItem={() => this.undoRemoval(activeItem)}
                    suffix={`> Step ${this.getActiveStepNumber()}`}
                    mod={this.getAlteration(activeItem, 'name')}
                    saveOrUpdateField={this.saveOrUpdateField}
                  />
                }
                navigation={
                  <RecipeNav
                    recipeItems={recipeItems}
                    recipeSteps={recipeItems.map(item => this.getSteps(item))}
                    activeItem={activeItem}
                    activeStep={activeStep}
                    setActiveStep={this.setActiveStep}
                  />
                }
                directions={
                  <Directions
                    step={activeStep}
                    mod={this.getAlteration(activeStep, 'directions')}
                    saveOrUpdateField={this.saveOrUpdateField}
                  />
                }
              />
              <div className={css.stepDetailContent}>
                <h3>Ingredients Used</h3>
                <IngredientList
                  createIngredient={() => this.createIngredient(activeStep.uid)}
                  editing={
                    activeIngredient !== null &&
                    activeStepIngredients.some(
                      ingredient => ingredient.uid === activeIngredient.uid
                    )
                  }
                >
                  {activeStepIngredients.map(ingredient => (
                    <Ingredient
                      key={ingredient.uid}
                      ingredient={ingredient}
                      ingredientMods={modification.alterations.filter(
                        mod => mod.sourceId === ingredient.uid
                      )}
                      removed={modification.removals.some(sourceId =>
                        [
                          activeItem.uid,
                          activeStep.uid,
                          ingredient.uid
                        ].includes(sourceId)
                      )}
                      editing={
                        activeIngredient !== null &&
                        activeIngredient.uid === ingredient.uid
                      }
                      removeIngredient={() => this.removeIngredient(ingredient)}
                      restoreIngredient={() =>
                        this.undoAnyRemovals(activeItem, activeStep, ingredient)
                      }
                      saveOrUpdateField={this.saveOrUpdateField}
                      setActiveIngredient={this.setActiveIngredient}
                    />
                  ))}
                </IngredientList>
              </div>
            </div>
          </aside>
        </article>
        <RecipeBio author={recipe.author} />
      </>
    );
  }
}
