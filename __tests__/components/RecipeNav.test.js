import { shallow } from 'enzyme';
import React from 'react';

import RecipeNav from 'schooled-lunch/client/components/RecipeNav';
import generateId from 'schooled-lunch/client/utils/generateId';

let props = {};

beforeEach(() => {
  props.recipeItems = [
    {
      _id: generateId(),
      name: 'Boozy Drink'
    },
    {
      _id: generateId(),
      name: 'Moar Booze'
    }
  ];
  props.recipeSteps = [
    [
      {
        _id: generateId(),
        directions: 'Do the first thing',
        ingredients: [
          {
            _id: generateId(),
            name: 'wine',
            quantity: 1,
            unit: 'cup'
          }
        ]
      },
      {
        _id: generateId(),
        directions: 'Do the second thing',
        ingredients: [
          {
            _id: generateId(),
            name: 'whiskey',
            quantity: 1,
            unit: 'gallon'
          }
        ]
      }
    ],
    [
      {
        _id: generateId(),
        directions: 'Do the third',
        ingredients: [
          {
            _id: generateId(),
            name: 'gin',
            quantity: 1,
            unit: 'tsp'
          }
        ]
      }
    ]
  ];
  props.activeItem = props.recipeItems[0];
  props.activeStep = props.recipeSteps[0][0];
  props.setActiveStep = jest.fn();
});

describe('It navigates between steps', () => {
  test('navigates to the next steps', () => {
    const wrapper = shallow(<RecipeNav {...props} />);

    wrapper.find('[title^="Next"]').simulate('click');
    expect(props.setActiveStep).toHaveBeenCalledWith(
      props.recipeItems[0],
      props.recipeSteps[0][1]
    );
  });

  test('jumps to next item when next is clicked on last step', () => {
    props.activeStep = props.recipeSteps[0][props.recipeSteps[0].length - 1];
    const wrapper = shallow(<RecipeNav {...props} />);

    wrapper.find('[title^="Next"]').simulate('click');
    expect(props.setActiveStep).toHaveBeenCalledWith(
      props.recipeItems[1],
      props.recipeSteps[1][0]
    );
  });
});
