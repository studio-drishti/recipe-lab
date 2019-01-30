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
    activeItem: this.props.recipe.items[0],
    activeStep: this.props.recipe.items[0].steps[0],
    activeIngredient: null,
    recipe: this.props.recipe,
    modification: {
      sortItems: [],
      sortSteps: [],
      alterations: [],
      removedItems: [],
      removedSteps: [],
      removedIngredients: [],
      additionalItems: [],
      additionalSteps: [],
      additionalIngredients: []
    },
    editingId: null
  };

  componentDidMount() {
    const { recipe } = this.state;
    let { modification } = this.state;

    if (localStorage.getItem(`MOD-${recipe._id}`)) {
      modification = Object.assign(
        modification,
        JSON.parse(localStorage.getItem(`MOD-${recipe._id}`))
      );
    }

    // Apply any step sorting modifications
    modification.sortSteps.forEach(mod => {
      const itemIndex = recipe.items.findIndex(item => item._id === mod.itemId);
      recipe.items[itemIndex].steps = recipe.items[itemIndex].steps.sort(
        (a, b) => mod.steps.indexOf(a._id) > mod.steps.indexOf(b._id)
      );
    });

    // Apply item sort mofidification if any exists
    if (modification.sortItems.length) {
      recipe.items = recipe.items.sort(
        (a, b) =>
          modification.sortItems.indexOf(a._id) >
          modification.sortItems.indexOf(b._id)
      );
    }

    this.setState({ recipe, modification });
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
    const { modification, recipe } = this.state;
    modification.alterations = updateOrInsertInArray(
      modification.alterations,
      {
        sourceId: source._id,
        field,
        value
      },
      'sourceId',
      'field'
    );

    localStorage.setItem(`MOD-${recipe._id}`, JSON.stringify(modification));

    this.setState({ modification });

    // check if alteration is the same as original
    // if (origin[field] === value) {
    //   // remove
    // }

    // If making modifications and item is deleted, undo the deletion
    // const restoredIngredientIndex = modification.removedIngredients.indexOf(
    //   editingId
    // );
    // if (restoredIngredientIndex > -1) {
    //   modification.removedIngredients.splice(restoredIngredientIndex, 1);
    // }
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

  onDragEnd = result => {
    // dropped outside the list or dropped in place
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const { modification, recipe } = this.state;

    // Handle onDragEnd for steps
    if (result.type.startsWith('STEP')) {
      const itemId = result.destination.droppableId;
      const itemIndex = recipe.items.findIndex(item => item._id === itemId);
      // Reorder the dropped step in the recipe item array
      recipe.items[itemIndex].steps = reorder(
        recipe.items[itemIndex].steps,
        result.source.index,
        result.destination.index
      );
      // Update or insert the step sort modification
      modification.sortSteps = updateOrInsertInArray(
        modification.sortSteps,
        {
          itemId: itemId,
          steps: recipe.items[itemIndex].steps.map(step => step._id)
        },
        'itemId'
      );
    } else if (result.type.startsWith('ITEM')) {
      // Reorder the dropped item in the recipe item array
      recipe.items = reorder(
        recipe.items,
        result.source.index,
        result.destination.index
      );
      modification.sortItems = recipe.items.map(item => item._id);
    }

    // Save changes to local storage and update state
    localStorage.setItem('modification', JSON.stringify(modification));
    this.setState({ recipe, modification });
  };

  removeIngredient = ingredient => {
    const { modification } = this.state;

    if (!modification.removedIngredients.includes(ingredient._id)) {
      modification.removedIngredients.push(ingredient._id);
      this.setState({ modification });
    }

    // Clear any saved modifications for the deleted ingredient
    modification.alterations = modification.alterations.filter(
      mod => mod.sourceId !== ingredient._id
    );

    localStorage.setItem('modification', JSON.stringify(modification));
  };

  restoreIngredient = ingredient => {
    const { modification } = this.state;
    const restoredIngredientIndex = modification.removedIngredients.indexOf(
      ingredient._id
    );

    if (restoredIngredientIndex > -1) {
      modification.removedIngredients.splice(restoredIngredientIndex, 1);
      this.setState({ modification });
    }

    localStorage.setItem('modification', JSON.stringify(modification));
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
          {recipe.items.map(item => (
            <div key={item._id}>
              <h3>Ingredients for {this.getItemValue(item, 'name')}</h3>
              <IngredientTotals
                steps={item.steps}
                removedIngredients={modification.removedIngredients}
                alterations={modification.alterations}
              />
            </div>
          ))}

          <DragDropContext onDragEnd={this.onDragEnd}>
            <ItemList recipeId={recipe._id}>
              {recipe.items.map((item, itemI) => (
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
                    {item.steps.map((step, stepI) => (
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
                        removed={modification.removedIngredients.includes(
                          ingredient._id
                        )}
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
