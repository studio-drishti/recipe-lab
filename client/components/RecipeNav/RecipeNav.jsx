import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

import css from './RecipeNav.css';

export default class Ingredient extends Component {
  static displayName = 'RecipeNav';

  static propTypes = {
    recipeItems: PropTypes.arrayOf(PropTypes.object),
    activeItem: PropTypes.object,
    activeStep: PropTypes.object,
    setActiveStep: PropTypes.func
  };

  static defaultProps = {
    recipeItems: []
  };

  nextStep = () => {
    const { activeItem, activeStep, recipeItems, setActiveStep } = this.props;
    let itemIndex = recipeItems.findIndex(item => item._id === activeItem._id);
    let stepIndex = activeItem.steps.findIndex(
      step => step._id === activeStep._id
    );

    if (stepIndex + 1 < activeItem.steps.length) {
      stepIndex++;
    } else if (itemIndex + 1 < recipeItems.length) {
      itemIndex++;
      stepIndex = 0;
    }

    setActiveStep(
      recipeItems[itemIndex],
      recipeItems[itemIndex].steps[stepIndex]
    );
  };

  prevStep = () => {
    const { activeItem, activeStep, recipeItems, setActiveStep } = this.props;
    let itemIndex = recipeItems.findIndex(item => item._id === activeItem._id);
    let stepIndex = activeItem.steps.findIndex(
      step => step._id === activeStep._id
    );
    if (stepIndex - 1 >= 0) {
      stepIndex--;
    } else if (itemIndex - 1 >= 0) {
      itemIndex--;
      stepIndex = recipeItems[itemIndex].steps.length - 1;
    }

    setActiveStep(
      recipeItems[itemIndex],
      recipeItems[itemIndex].steps[stepIndex]
    );
  };

  render() {
    const { recipeItems, activeItem, activeStep } = this.props;

    const activeItemIndex = recipeItems.findIndex(
      item => item._id === activeItem._id
    );
    const activeStepIndex = activeItem.steps.findIndex(
      step => step._id === activeStep._id
    );
    const hasPrevStep =
      (activeItemIndex === 0 && activeStepIndex > 0) || activeItemIndex > 0;
    const hasNextStep =
      activeItemIndex < recipeItems.length - 1 ||
      activeStepIndex < activeItem.steps.length - 1;

    return (
      <nav className={css.nav}>
        <button
          className={css.prev}
          title="Previous step"
          onClick={this.prevStep}
          disabled={!hasPrevStep}
        >
          <MdNavigateBefore />
        </button>
        <button
          className={css.next}
          title="Next step"
          onClick={this.nextStep}
          disabled={!hasNextStep}
        >
          <MdNavigateNext />
        </button>
      </nav>
    );
  }
}
