import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import { DragDropContext } from 'react-beautiful-dnd';

import css from './Recipe.css';

import reorder from '../../util/reorder';
import generateId from '../../util/generateId';
import areArraysEqual from '../../util/areArraysEqual';

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

export default class Recipe extends Component {
  static displayName = 'Recipe';

  static propTypes = {
    recipe: PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.object,
      time: PropTypes.string,
      skill: PropTypes.string,
      description: PropTypes.string,
      course: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.object)
    })
  };

  state = {
    recipe: this.props.recipe,
    activeItem: this.props.recipe.items[0],
    activeStep: this.props.recipe.items[0].steps[0],
    activeIngredient: null,
    localStoreId: `MOD-${this.props.recipe._id}`,
    modification: {
      sortings: [],
      alterations: [],
      removals: [],
      additions: []
    }
  };

  componentDidMount() {
    const { localStoreId } = this.state;
    let { modification } = this.state;

    if (localStorage.getItem(localStoreId)) {
      modification = Object.assign(
        modification,
        JSON.parse(localStorage.getItem(localStoreId))
      );
    }

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

  saveAlteration = (source, field, value) => {
    const { modification, localStoreId } = this.state;
    const alterationIndex = modification.alterations.findIndex(
      alteration =>
        alteration.field === field && alteration.sourceId === source._id
    );
    const alterationExists = alterationIndex > -1;

    if (!alterationExists && source[field] === value) return;

    const alteration = {
      sourceId: source._id,
      field,
      value
    };

    if (alterationExists && source[field] === value) {
      // Remove exisitng alteration if the new value is the same as the source
      modification.alterations.splice(alterationIndex, 1);
    } else if (alterationExists) {
      // Update existing alteration
      modification.alterations[alterationIndex] = alteration;
    } else {
      // Add new alteration
      modification.alterations.push(alteration);
    }

    localStorage.setItem(localStoreId, JSON.stringify(modification));
    this.setState({ modification });
  };

  updateAddition = (source, field, value) => {
    const { modification } = this.state;

    const index = modification.additions.findIndex(
      addition => addition._id === source._id
    );

    if (index === -1) return;

    modification.additions[index][field] = value;
    this.setState({ modification });
  };

  saveOrUpdateField = (source, fieldName, value) => {
    if ('kind' in source) {
      this.updateAddition(source, fieldName, value);
    } else {
      this.saveAlteration(source, fieldName, value);
    }
  };

  handleItemChange = (e, item) => {
    const { name, value } = e.target;
    const { activeItem } = this.state;
    const source = item !== undefined ? item : activeItem;
    this.saveAlteration(source, name, value);
  };

  handleStepChange = e => {
    const { name, value } = e.target;
    const { activeStep } = this.state;
    this.saveOrUpdateField(activeStep, name, value);
  };

  handleIngredientChange = e => {
    const { name, value } = e.target;
    const { activeIngredient } = this.state;
    this.saveOrUpdateField(activeIngredient, name, value);
  };

  saveRemoval = source => {
    const { modification, localStoreId } = this.state;

    // source was already removed
    if (modification.removals.includes(source._id)) return;

    modification.removals.push(source._id);

    // Clear any saved alterations for the deleted ingredient
    modification.alterations = modification.alterations.filter(
      mod => mod.sourceId !== source._id
    );

    this.setState({ modification });
    localStorage.setItem(localStoreId, JSON.stringify(modification));
  };

  deleteAdditions = (...sources) => {
    const { modification } = this.state;
    sources.forEach(source => {
      const index = modification.additions.findIndex(
        addition => addition._id === source._id
      );
      modification.additions.splice(index, 1);
    });
    this.setState({ modification });
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
        return result.push(...this.getUnsortedIngredients(step));
      }, []);
      this.deleteAdditions(item, ...steps, ...ingredients);
    } else {
      this.saveRemoval(step);
    }
  };

  undoRemoval = source => {
    const { modification, localStoreId } = this.state;
    const removalIndex = modification.removals.indexOf(source._id);

    if (removalIndex === -1) return;

    modification.removals.splice(removalIndex, 1);

    this.setState({ modification });
    localStorage.setItem(localStoreId, JSON.stringify(modification));
  };

  undoAnyRemovals = (...sources) => {
    sources.forEach(source => this.undoRemoval(source));
  };

  saveSorting = (parentId, unsorted, sourceI, destinationI) => {
    const { modification, localStoreId } = this.state;
    const sortingIndex = modification.sortings.findIndex(
      sorting => sorting.parentId === parentId
    );
    const sortingExists = sortingIndex > -1;
    const sorted = sortingExists
      ? this.getSorted(parentId, unsorted)
      : unsorted;

    const sorting = {
      parentId,
      order: reorder(sorted, sourceI, destinationI).map(child => child._id)
    };

    if (
      sortingExists &&
      areArraysEqual(sorting.order, unsorted.map(child => child._id))
    ) {
      // Remove existing sorting if the new value is the same as the source
      modification.sortings.splice(sortingIndex, 1);
    } else if (sortingExists) {
      // Update existing sorting
      modification.sortings[sortingIndex] = sorting;
    } else {
      // Add new sorting
      modification.sortings.push(sorting);
    }

    localStorage.setItem(localStoreId, JSON.stringify(modification));
    this.setState({ modification });
  };

  onDragEnd = result => {
    // dropped outside the list or dropped in place
    if (!result.destination || result.destination.index === result.source.index)
      return;

    const { recipe } = this.state;

    if (result.type.startsWith('ITEM')) {
      this.saveSorting(
        recipe._id,
        this.getUnsortedItems(),
        result.source.index,
        result.destination.index
      );
    } else if (result.type.startsWith('STEP')) {
      const itemId = result.destination.droppableId;
      const item = recipe.items.find(item => item._id === itemId);
      this.saveSorting(
        itemId,
        this.getUnsortedSteps(item),
        result.source.index,
        result.destination.index
      );
    }
  };

  createStep = itemId => {
    const { modification } = this.state;

    const addition = {
      _id: generateId(),
      kind: 'Step',
      parentId: itemId,
      directions: '',
      notes: ''
    };

    modification.additions.push(addition);
    this.setState({ modification });
  };

  createIngredient = async stepId => {
    const { modification } = this.state;

    const addition = {
      _id: generateId(),
      kind: 'Ingredient',
      parentId: stepId,
      quantity: '',
      unit: '',
      name: '',
      processing: ''
    };

    modification.additions.push(addition);

    await this.setState({ modification });
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

    return [...arr].sort(
      (a, b) => sortMod.order.indexOf(a._id) > sortMod.order.indexOf(b._id)
    );
  };

  getItems = (sorted = true) => {
    const { recipe, modification } = this.state;
    const addedItems = modification.additions.filter(
      addition => addition.parentId === recipe._id
    );
    const items = addedItems.length
      ? recipe.items.concat(addedItems)
      : recipe.items;
    return sorted ? this.getSorted(recipe._id, items) : items;
  };

  getUnsortedItems = () => {
    return this.getItems(false);
  };

  getSteps = (item, sorted = true) => {
    const { modification } = this.state;
    const steps = modification.additions.filter(
      addition => addition.parentId === item._id
    );
    if ('steps' in item) steps.unshift(...item.steps);
    return sorted ? this.getSorted(item._id, steps) : steps;
  };

  getUnsortedSteps = item => {
    return this.getSteps(item, false);
  };

  getIngredients = (step, sorted = true) => {
    const { modification } = this.state;
    const ingredients = modification.additions.filter(
      addition => addition.parentId === step._id
    );
    if ('ingredients' in step) ingredients.unshift(...step.ingredients);
    return sorted ? this.getSorted(step._id, ingredients) : ingredients;
  };

  getUnsortedIngredients = step => {
    return this.getIngredients(step, false);
  };

  getAlteration = (source, fieldName) => {
    const { modification } = this.state;
    const mod = modification.alterations.find(
      mod => mod.sourceId === source._id && mod.field === fieldName
    );
    return mod ? mod.value : undefined;
  };

  getItemValue = (item, fieldName) => {
    const mod = this.getAlteration(item, fieldName);
    return mod !== undefined ? mod : item[fieldName];
  };

  getActiveStepNumber = () => {
    const { activeItem, activeStep } = this.state;
    return (
      this.getSteps(activeItem).findIndex(step => step._id === activeStep._id) +
      1
    );
  };

  render() {
    const {
      recipe,
      activeItem,
      activeStep,
      activeIngredient,
      modification
    } = this.state;

    const swiperParams = {
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      spaceBetween: 20
    };

    return (
      <article className={css.recipe}>
        <div className={css.recipeMain}>
          <div className={css.ingredientTotals}>
            {this.getItems()
              .filter(item => !modification.removals.includes(item._id))
              .map(item => (
                <div key={item._id}>
                  <h3>Ingredients for {this.getItemValue(item, 'name')}</h3>
                  <IngredientTotals
                    ingredients={this.getSteps(item)
                      .filter(step => !modification.removals.includes(step._id))
                      .reduce((result, step) => {
                        return result.concat(
                          this.getIngredients(step).filter(
                            ingredient =>
                              !modification.removals.includes(ingredient._id)
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
            <ItemList recipeId={recipe._id}>
              {this.getItems().map((item, itemI) => (
                <Item
                  key={item._id}
                  itemId={item._id}
                  index={itemI}
                  removed={modification.removals.includes(item._id)}
                  removeItem={() => this.removeItem(item)}
                  restoreItem={() => this.undoRemoval(item)}
                  createStep={() => this.createStep(item._id)}
                  itemName={
                    <ItemName
                      item={item}
                      prefix="Directions for"
                      mod={this.getAlteration(item, 'name')}
                      handleItemChange={this.handleItemChange}
                    />
                  }
                >
                  <StepList itemId={item._id}>
                    {this.getSteps(item).map((step, stepI) => (
                      <Step
                        key={step._id}
                        index={stepI}
                        itemId={item._id}
                        stepId={step._id}
                        removed={modification.removals.some(sourceId =>
                          [item._id, step._id].includes(sourceId)
                        )}
                        isActive={
                          activeItem._id === item._id &&
                          activeStep._id === step._id
                        }
                        activateStep={() => this.setActiveStep(item, step)}
                        removeStep={() => this.removeStep(step)}
                        restoreStep={() => this.undoAnyRemovals(item, step)}
                      >
                        <Directions
                          directions={step.directions}
                          mod={this.getAlteration(step, 'directions')}
                          handleStepChange={this.handleStepChange}
                        />
                      </Step>
                    ))}
                  </StepList>
                </Item>
              ))}
            </ItemList>
          </DragDropContext>
        </div>
        <aside className={css.recipeDetail}>
          <div className={css.sticky}>
            <StepHeader
              activeStep={activeStep}
              removed={modification.removals.some(sourceId =>
                [activeItem._id, activeStep._id].includes(sourceId)
              )}
              removeStep={() => this.saveRemoval(activeStep)}
              restoreStep={() => this.undoAnyRemovals(activeItem, activeStep)}
              itemName={
                <ItemName
                  item={activeItem}
                  removed={modification.removals.includes(activeItem._id)}
                  restoreItem={() => this.undoRemoval(activeItem)}
                  suffix={`> Step ${this.getActiveStepNumber()}`}
                  mod={this.getAlteration(activeItem, 'name')}
                  handleItemChange={this.handleItemChange}
                />
              }
              navigation={
                <RecipeNav
                  recipeItems={this.getItems()}
                  activeItem={activeItem}
                  activeStep={activeStep}
                  setActiveStep={this.setActiveStep}
                />
              }
              directions={
                <Directions
                  directions={activeStep.directions}
                  mod={this.getAlteration(activeStep, 'directions')}
                  handleStepChange={this.handleStepChange}
                />
              }
            />
            <div className={css.recipeDetailContent}>
              <Swiper {...swiperParams}>
                <img
                  src={`https://loremflickr.com/530/300/food,cooking,spaghetti?s=${
                    activeStep._id
                  }_1`}
                />
                <img
                  src={`https://loremflickr.com/530/300/food,cooking,spaghetti?s=${
                    activeStep._id
                  }_2`}
                />
                <img
                  src={`https://loremflickr.com/530/300/food,cooking,spaghetti?s=${
                    activeStep._id
                  }_3`}
                />
              </Swiper>

              {this.getIngredients(activeStep).length > 0 && (
                <div>
                  <h3>Ingredients Used</h3>
                  <IngredientList
                    createIngredient={() =>
                      this.createIngredient(activeStep._id)
                    }
                    editing={
                      activeIngredient !== null &&
                      this.getIngredients(activeStep).some(
                        ingredient => ingredient._id === activeIngredient._id
                      )
                    }
                  >
                    {this.getIngredients(activeStep).map(ingredient => (
                      <Ingredient
                        key={ingredient._id}
                        ingredient={ingredient}
                        ingredientMods={modification.alterations.filter(
                          mod => mod.sourceId === ingredient._id
                        )}
                        removed={modification.removals.some(sourceId =>
                          [
                            activeItem._id,
                            activeStep._id,
                            ingredient._id
                          ].includes(sourceId)
                        )}
                        editing={
                          activeIngredient !== null &&
                          activeIngredient._id === ingredient._id
                        }
                        removeIngredient={() =>
                          this.removeIngredient(ingredient)
                        }
                        restoreIngredient={() =>
                          this.undoAnyRemovals(
                            activeItem,
                            activeStep,
                            ingredient
                          )
                        }
                        handleIngredientChange={this.handleIngredientChange}
                        setActiveIngredient={this.setActiveIngredient}
                      />
                    ))}
                  </IngredientList>
                </div>
              )}

              {/* <h3>Notes</h3>
              {editing ? (
                <Textarea
                  name="notes"
                  value={activeStep.notes}
                  placeholder="Additional Notes"
                  onChange={this.handleStepChange}
                />
              ) : (
                <p>{activeStep.notes}</p>
              )} */}
            </div>
          </div>
        </aside>
      </article>
    );
  }
}
