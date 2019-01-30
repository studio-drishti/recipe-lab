import { shallow } from 'enzyme';
import React from 'react';

import Recipe from 'schooled-lunch/client/components/Recipe';
import generateId from 'schooled-lunch/client/util/generateId';

let props;

beforeEach(() => {
  props = {
    recipe: {
      _id: generateId(),
      title: 'Spaghetti and Meatballs',
      author: {
        _id: generateId(),
        name: 'Test McTester'
      },
      time: 'medium',
      skill: 'easy',
      description: "It's food!",
      course: 'main',
      items: [
        {
          _id: generateId(),
          name: 'Food thingy',
          steps: [
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
                  name: 'wine',
                  quantity: 1,
                  unit: 'cup'
                }
              ]
            }
          ]
        }
      ]
    }
  };
});

describe('It saves alterations', () => {
  test('saves an alteration to localstorage', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    instance.saveAlteration(props.recipe, 'title', 'Cheese Steak');
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(
      JSON.parse(localStorage.__STORE__[`MOD-${props.recipe._id}`])
    ).toEqual(
      expect.objectContaining({
        alterations: expect.arrayContaining([
          expect.objectContaining({
            sourceId: props.recipe._id,
            field: 'title',
            value: 'Cheese Steak'
          })
        ])
      })
    );
  });
});
