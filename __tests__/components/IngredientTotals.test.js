import { shallow } from 'enzyme';
import React from 'react';

import IngredientTotals from 'schooled-lunch/client/components/IngredientTotals';
import generateId from 'schooled-lunch/client/util/generateId';

let props;

beforeEach(() => {
  props = {
    ingredients: [
      {
        _id: generateId(),
        name: 'wine',
        quantity: 1,
        unit: 'cup'
      },
      {
        _id: generateId(),
        name: 'wine',
        quantity: 1,
        unit: 'cup'
      }
    ]
  };
});

describe('Calculating ingredient totals', () => {
  test('returns 2 cups wine, divided', () => {
    const wrapper = shallow(<IngredientTotals {...props} />);

    expect(wrapper.instance().getIngredientTotals()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'wine',
          divided: true,
          quantities: [
            {
              unit: 'cup',
              quantity: 2
            }
          ]
        })
      ])
    );
  });

  test('sort cups before tbsp', () => {
    props.ingredients[1].unit = 'tbsp';
    const wrapper = shallow(<IngredientTotals {...props} />);

    expect(wrapper.instance().getIngredientTotals()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          quantities: [
            {
              quantity: 1,
              unit: 'cup'
            },
            {
              quantity: 1,
              unit: 'tbsp'
            }
          ]
        })
      ])
    );
  });

  test('rewrites modified ingredients', () => {
    props.alterations = [
      {
        sourceId: props.ingredients[0]._id,
        field: 'name',
        value: 'whiskey'
      },
      {
        sourceId: props.ingredients[0]._id,
        field: 'quantity',
        value: 2
      },
      {
        sourceId: props.ingredients[0]._id,
        field: 'unit',
        value: 'gal'
      }
    ];
    const wrapper = shallow(<IngredientTotals {...props} />);
    expect(wrapper.instance().getIngredientTotals()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'whiskey',
          quantities: [
            {
              unit: 'gal',
              quantity: 2
            }
          ]
        })
      ])
    );
  });
});
