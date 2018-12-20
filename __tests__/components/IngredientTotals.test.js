import { shallow } from 'enzyme';
import React from 'react';

import IngredientTotals from 'schooled-lunch/client/components/IngredientTotals';

const setup = propOverrides => {
  const props = Object.assign(
    {
      steps: [
        {
          _id: 1,
          ingredients: [
            {
              name: 'wine',
              quantity: 1,
              unit: 'cup'
            }
          ]
        },
        {
          _id: 2,
          ingredients: [
            {
              name: 'wine',
              quantity: 1,
              unit: 'cup'
            }
          ]
        }
      ]
    },
    propOverrides
  );

  const wrapper = shallow(<IngredientTotals {...props} />);

  return {
    props,
    wrapper,
    del: wrapper.find('del'),
    ins: wrapper.find('ins')
  };
};

describe('Calculating ingredient totals', () => {
  test('returns 2 cups wine, divided', () => {
    const { wrapper } = setup();

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

  it('should sort cups before tbsp', () => {
    const { wrapper } = setup({
      steps: [
        {
          ingredients: [
            {
              name: 'whiskey',
              quantity: 3.5,
              unit: 'tbsp'
            }
          ]
        },
        {
          ingredients: [
            {
              name: 'whiskey',
              quantity: 1,
              unit: 'cup'
            }
          ]
        }
      ]
    });

    expect(wrapper.instance().getIngredientTotals()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          quantities: [
            {
              quantity: 1,
              unit: 'cup'
            },
            {
              quantity: 3.5,
              unit: 'tbsp'
            }
          ]
        })
      ])
    );
  });
});
