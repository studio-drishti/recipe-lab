import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import Swiper from 'react-id-swiper';
import { DragDropContext } from 'react-beautiful-dnd';
import { MdEdit, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

import css from './Recipe.css';
import reorder from '../../util/reorder';
import { updateOrInsertInArray } from '../../util/arrayTools';

import StepList from '../StepList';
import Step from '../Step';
import ItemList from '../ItemList';
import Item from '../Item';
import IngredientList from '../IngredientList';
import Ingredient from '../Ingredient';
import IngredientTotals from '../IngredientTotals';
import DiffText from '../DiffText';

export default class Recipe extends Component {
  static displayName = 'Recipe';

  static propTypes = {
    recipe: PropTypes.object
  };

  state = {
    activeItem: this.props.recipe.items[0],
    activeStep: this.props.recipe.items[0].steps[0],
    recipe: this.props.recipe,
    modification: {
      sortItems: [],
      sortSteps: [],
      alteredItems: [],
      alteredSteps: [],
      alteredIngredients: [],
      removedItems: [],
      removedSteps: [],
      removedIngredients: [],
      additionalItems: [],
      additionalSteps: [],
      additionalIngredients: []
    },
    editing: false,
    editingId: null
  };

  componentDidMount() {
    const { recipe } = this.state;
    let { modification } = this.state;

    if (localStorage.getItem('modification')) {
      modification = Object.assign(
        modification,
        JSON.parse(localStorage.getItem('modification'))
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

  toggleEdit = () => {
    if (this.state.editing === false) {
      this.setState({ editing: true });
    } else {
      this.setState({ editing: false });
    }
  };

  setEditingId = id => {
    this.setState({ editingId: id });
  };

  nextStep = () => {
    let { activeItem, activeStep, recipe } = this.state;
    const nextItemIndex =
      recipe.items.findIndex(item => item._id === activeItem._id) + 1;
    const nextStepIndex =
      activeItem.steps.findIndex(step => step._id === activeStep._id) + 1;
    if (nextStepIndex < activeItem.steps.length) {
      activeStep = activeItem.steps[nextStepIndex];
    } else if (nextItemIndex < recipe.items.length) {
      activeItem = recipe.items[nextItemIndex];
      activeStep = recipe.items[nextItemIndex].steps[0];
    }
    this.setState({ activeStep, activeItem });
  };

  prevStep = () => {
    let { activeItem, activeStep, recipe } = this.state;
    const prevItemIndex =
      recipe.items.findIndex(item => item._id === activeItem._id) - 1;
    const prevStepIndex =
      activeItem.steps.findIndex(step => step._id === activeStep._id) - 1;
    if (prevStepIndex >= 0) {
      activeStep = activeItem.steps[prevStepIndex];
    } else if (prevItemIndex >= 0) {
      activeItem = recipe.items[prevItemIndex];
      activeStep =
        recipe.items[prevItemIndex].steps[activeItem.steps.length - 1];
    }
    this.setState({ activeStep, activeItem });
  };

  handleStepChange = e => {
    const { name, value } = e.target;
    const { activeStep, modification } = this.state;

    modification.alteredSteps = updateOrInsertInArray(
      modification.alteredSteps,
      {
        stepId: activeStep._id,
        field: name,
        value: value
      },
      'stepId'
    );

    localStorage.setItem('modification', JSON.stringify(modification));
    this.setState({ modification });
  };

  handleIngredientChange = e => {
    const { name, value } = e.target;
    const { modification, editingId } = this.state;

    modification.alteredIngredients = updateOrInsertInArray(
      modification.alteredIngredients,
      {
        ingredientId: editingId,
        field: name,
        value: value
      },
      'ingredientId',
      'field'
    );

    localStorage.setItem('modification', JSON.stringify(modification));
    this.setState({ modification });
  };

  getStepDirectionsValue = step => {
    const { modification } = this.state;
    const mod = modification.alteredSteps.find(
      mod => mod.stepId === step._id && mod.field === 'directions'
    );
    return mod ? mod.value : step.directions;
  };

  setActiveStep = (itemI, stepI) => {
    this.setState({
      activeItem: this.state.recipe.items[itemI],
      activeStep: this.state.recipe.items[itemI].steps[stepI]
    });
  };

  renderDirectionsWithMods = step => {
    const { modification } = this.state;
    const mod = modification.alteredSteps.find(
      mod => mod.stepId === step._id && mod.field === 'directions'
    );
    if (mod) {
      return <DiffText original={step.directions} modified={mod.value} />;
    }
    return step.directions;
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
  };

  render() {
    const {
      recipe,
      activeItem,
      activeStep,
      editing,
      modification,
      editingId
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

    const activeItemIndex = recipe.items.findIndex(
      item => item._id === activeItem._id
    );
    const activeStepIndex = activeItem.steps.findIndex(
      step => step._id === activeStep._id
    );
    const hasPrevStep =
      (activeItemIndex === 0 && activeStepIndex > 0) || activeItemIndex > 0;
    const hasNextStep =
      activeItemIndex < recipe.items.length - 1 ||
      activeStepIndex < activeItem.steps.length - 1;

    return (
      <article className={css.recipe}>
        <div className={css.recipeMain}>
          {recipe.items.map(item => (
            <div key={item._id}>
              <h3>Ingredients for {item.name}</h3>
              <IngredientTotals steps={item.steps} />
            </div>
          ))}

          <DragDropContext onDragEnd={this.onDragEnd}>
            <ItemList recipeId={recipe._id}>
              {recipe.items.map((item, itemI) => (
                <Item key={item._id} item={item} index={itemI}>
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
                        clickHandler={() => this.setActiveStep(itemI, stepI)}
                        content={this.renderDirectionsWithMods(step)}
                      />
                    ))}
                  </StepList>
                </Item>
              ))}
            </ItemList>
          </DragDropContext>
        </div>
        <aside className={css.recipeDetail}>
          <div className={css.sticky}>
            <header className={css.recipeDetailHeader}>
              <div className={css.recipeDetailToolbar}>
                <h6>
                  {activeItem.name} &gt; Step {activeStepIndex + 1}
                </h6>
                <div className={css.recipeActions}>
                  <button onClick={this.toggleEdit}>
                    <MdEdit />
                  </button>
                  <button onClick={this.prevStep} disabled={!hasPrevStep}>
                    <MdNavigateBefore />
                  </button>
                  <button onClick={this.nextStep} disabled={!hasNextStep}>
                    <MdNavigateNext />
                  </button>
                </div>
              </div>

              {editing ? (
                <Textarea
                  name="directions"
                  value={this.getStepDirectionsValue(activeStep)}
                  placeholder={
                    activeStep.directions.length
                      ? activeStep.directions
                      : 'Directions'
                  }
                  onChange={this.handleStepChange}
                />
              ) : (
                <p>{this.renderDirectionsWithMods(activeStep)}</p>
              )}
            </header>
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
                    editing={activeStep.ingredients.some(
                      ingredient => ingredient._id === editingId
                    )}
                  >
                    {activeStep.ingredients.map(ingredient => (
                      <Ingredient
                        key={ingredient._id}
                        ingredient={ingredient}
                        ingredientMods={modification.alteredIngredients.filter(
                          mod => mod.ingredientId === ingredient._id
                        )}
                        removed={modification.removedIngredients.includes(
                          ingredient._id
                        )}
                        editing={editingId === ingredient._id}
                        removeAction={this.removeIngredient}
                        restoreAction={this.restoreIngredient}
                        handleIngredientChange={this.handleIngredientChange}
                        setEditingId={this.setEditingId}
                      />
                    ))}
                  </IngredientList>
                </div>
              )}

              <h3>Notes</h3>
              {editing ? (
                <Textarea
                  name="notes"
                  value={activeStep.notes}
                  placeholder="Additional Notes"
                  onChange={this.handleStepChange}
                />
              ) : (
                <p>{activeStep.notes}</p>
              )}
            </div>
          </div>
        </aside>
      </article>
    );
  }
}
