//Editing
//Deleting
//restoring

import { shallow } from 'enzyme';
import React from 'react';
// import renderer from 'react-test-renderer'

import Ingredient from 'schooled-lunch/client/components/Ingredient';

describe('Displaying ingredient', () => {
  test('ingredient renders with all possible fields', () => {
    const props = {
      quantity: 1,
      unit: 'tbsp',
      name: 'oil',
      processing: 'Fresh pressed!!!!'
    };

    const wrapper = shallow(<Ingredient {...props} />);
    expect(wrapper.text()).toEqual('1 tbsp oil Fresh pressed!!!!');
    expect(wrapper.find());
    // expect to have trash button
  });

  test('Processing does not display if no value is provided', () => {
    const props = {
      quantity: 14.3,
      unit: 'cups',
      name: 'OctopieMen'
    };

    const wrapper = shallow(<Ingredient {...props} />);
    expect(wrapper.text()).toEqual('14.3 flimflams OctopieMen');
  });

  test('Unit does not display if no value is provided', () => {
    const props = {
      quantity: 1000,
      name: 'OctopieMen',
      processing: 'Dancing'
    };

    const wrapper = shallow(<Ingredient {...props} />);
    expect(wrapper.text()).toEqual('1000 OctopieMen Dancing');
  });

  test('Deleting an ingredient causes it to be restorable', () => {
    const props = {
      quantity: 1000,
      name: 'OctopieMen',
      processing: 'Dancing'
    };

    const wrapper = shallow(<Ingredient {...props} />);
    // click on trash button
    // expect context button to be restore
    // expect ingredient to be crossed out
  });

  test('Displays as form inputs when editing is enabled', () => {
    const props = {
      quantity: 1000,
      name: 'OctopieMen',
      processing: 'Dancing',
      editing: true
    };

    const wrapper = shallow(<Ingredient {...props} />);
    // expect(wrapper.text()).toEqual('1000 OctopieMen Dancing');
    // expect container to have inputs
    // expect context sensitive btn to be "save"
  });

  // it requires quantity and name
});
