import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import { DragDropContext } from 'react-beautiful-dnd';

import css from './Recipe.css';
import reorder from '../../util/reorder';
import { updateOrInsertInArray } from '../../util/arrayTools';

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
      additionalItems: [],
      additionalSteps: [],
      additionalIngredients: []
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

  setActiveStep = (itemI, stepI) => {
    this.setState({
      activeItem: this.state.recipe.items[itemI],
      activeStep: this.state.recipe.items[itemI].steps[stepI]
    });
  };

  setActiveIngredient = ingredient => {
    this.setState({ activeIngredient: ingredient });
  };

  saveAlteration = (source, field, value) => {
    const { modification, localStoreId } = this.state;
    const alterationIndex = modification.alterations.findIndex(
      item => item.field === field && item.sourceId === source._id
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

    // TODO: If making modifications and source was deleted, undo the deletion
    // const restoredIngredientIndex = modification.removedIngredients.indexOf(
    //   editingId
    // );
    // if (restoredIngredientIndex > -1) {
    //   modification.removedIngredients.splice(restoredIngredientIndex, 1);
    // }

    localStorage.setItem(localStoreId, JSON.stringify(modification));
    this.setState({ modification });
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
    this.saveAlteration(activeStep, name, value);
  };

  handleIngredientChange = e => {
    const { name, value } = e.target;
    const { activeIngredient } = this.state;
    this.saveAlteration(activeIngredient, name, value);
  };

  saveRemoval = source => {
    const { modification, localStoreId } = this.state;

    if (modification.removals.includes(source._id)) return;

    modification.removals.push(source._id);

    // Clear any saved alterations for the deleted ingredient
    modification.alterations = modification.alterations.filter(
      mod => mod.sourceId !== source._id
    );

    this.setState({ modification });
    localStorage.setItem(localStoreId, JSON.stringify(modification));
  };

  undoRemoval = source => {
    const { modification, localStoreId } = this.state;
    const removalIndex = modification.removals.indexOf(source._id);

    if (removalIndex === -1) return;

    modification.removals.splice(removalIndex, 1);

    this.setState({ modification });
    localStorage.setItem(localStoreId, JSON.stringify(modification));
  };

  removeIngredient = ingredient => {
    this.saveRemoval(ingredient);
  };

  restoreIngredient = ingredient => {
    this.undoRemoval(ingredient);
  };

  saveSorting = (parentId, arr, sourceI, destinationI) => {
    const { modification, localStoreId } = this.state;
    // Save changes to local storage and update state

    modification.sortings = updateOrInsertInArray(
      modification.sortings,
      {
        parentId: parentId,
        order: reorder(arr, sourceI, destinationI).map(child => child._id)
      },
      'parentId'
    );

    localStorage.setItem(localStoreId, JSON.stringify(modification));
    this.setState({ modification });
  };

  onDragEnd = result => {
    // dropped outside the list or dropped in place
    if (!result.destination || result.destination.index === result.source.index)
      return;

    const { recipe } = this.state;

    if (result.type.startsWith('STEP')) {
      const itemId = result.destination.droppableId;
      const item = recipe.items.find(item => item._id === itemId);
      this.saveSorting(
        itemId,
        item.steps,
        result.source.index,
        result.destination.index
      );
    } else if (result.type.startsWith('ITEM')) {
      this.saveSorting(
        recipe._id,
        recipe.items,
        result.source.index,
        result.destination.index
      );
    }
  };

  getSorted = (parentId, arr) => {
    const { modification } = this.state;
    const sortMod = modification.sortings.find(
      mod => mod.parentId === parentId
    );

    if (sortMod === undefined) return arr;

    return arr.sort(
      (a, b) => sortMod.order.indexOf(a._id) > sortMod.order.indexOf(b._id)
    );
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
    return activeItem.steps.findIndex(step => step._id === activeStep._id) + 1;
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
          {this.getSorted(recipe._id, recipe.items).map(item => (
            <div key={item._id}>
              <h3>Ingredients for {this.getItemValue(item, 'name')}</h3>
              <IngredientTotals
                steps={item.steps}
                removals={modification.removals}
                alterations={modification.alterations}
              />
            </div>
          ))}

          <DragDropContext onDragEnd={this.onDragEnd}>
            <ItemList recipeId={recipe._id}>
              {this.getSorted(recipe._id, recipe.items).map((item, itemI) => (
                <Item
                  key={item._id}
                  itemId={item._id}
                  index={itemI}
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
                    {this.getSorted(item._id, item.steps).map((step, stepI) => (
                      <Step
                        key={step._id}
                        index={stepI}
                        itemId={item._id}
                        stepId={step._id}
                        isActive={
                          activeItem._id === item._id &&
                          activeStep._id === step._id
                        }
                        setActiveStep={() => this.setActiveStep(itemI, stepI)}
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
              itemName={
                <ItemName
                  item={activeItem}
                  suffix={`> Step ${this.getActiveStepNumber()}`}
                  mod={this.getAlteration(activeItem, 'name')}
                  handleItemChange={this.handleItemChange}
                />
              }
              navigation={
                <RecipeNav
                  recipeItems={recipe.items}
                  activeItem={activeItem}
                  activeStep={activeStep}
                  setActiveStep={this.setActiveStep}
                />
              }
              directions={
                <Directions
                  directions={activeStep.directions}
                  mod={this.getAlteration(activeStep, 'directions')}
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

              {activeStep.ingredients.length > 0 && (
                <div>
                  <h3>Ingredients Used</h3>
                  <IngredientList
                    editing={
                      activeIngredient !== null &&
                      activeStep.ingredients.some(
                        ingredient => ingredient._id === activeIngredient._id
                      )
                    }
                  >
                    {activeStep.ingredients.map(ingredient => (
                      <Ingredient
                        key={ingredient._id}
                        ingredient={ingredient}
                        ingredientMods={modification.alterations.filter(
                          mod => mod.sourceId === ingredient._id
                        )}
                        removed={modification.removals.includes(ingredient._id)}
                        editing={
                          activeIngredient !== null &&
                          activeIngredient._id === ingredient._id
                        }
                        removeAction={this.removeIngredient}
                        restoreAction={this.restoreIngredient}
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
