import { shallow } from 'enzyme';
import React from 'react';

import RecipeNav from 'schooled-lunch/client/components/RecipeNav';
import cuid from 'cuid';

let props = {};

beforeEach(() => {
  props.recipeItems = [
    {
      uid: cuid(),
      name: 'Boozy Drink'
    },
    {
      uid: cuid(),
      name: 'Moar Booze'
    }
  ];
  props.recipeSteps = [
    [
      {
        uid: cuid(),
        directions: 'Do the first thing',
        ingredients: [
          {
            uid: cuid(),
            name: 'wine',
            quantity: 1,
            unit: 'cup'
          }
        ]
      },
      {
        uid: cuid(),
        directions: 'Do the second thing',
        ingredients: [
          {
            uid: cuid(),
            name: 'whiskey',
            quantity: 1,
            unit: 'gallon'
          }
        ]
      }
    ],
    [
      {
        uid: cuid(),
        directions: 'Do the third',
        ingredients: [
          {
            uid: cuid(),
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
