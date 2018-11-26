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
      ingredient: {
        quantity: 1,
        unit: 'tbsp',
        name: 'oil',
        processing: 'Fresh pressed!!!!'
      },
      modifications: {},
      editing: false
    };

    const wrapper = shallow(<Ingredient {...props} />);
    expect(wrapper.text()).toContain('1tbspoil,Fresh pressed!!!!');
    expect(wrapper.exists('[data-test-btn-state="remove"]'));
  });

  test('Processing does not display if no value is provided', () => {
    const props = {
      ingredient: {
        quantity: 14.3,
        unit: 'cups',
        name: 'OctopieMen'
      },
      modifications: {},
      editing: false
    };

    const wrapper = shallow(<Ingredient {...props} />);
    expect(wrapper.text()).toContain('14.3cupsOctopieMen');
  });

  test('Unit does not display if no value is provided', () => {
    const props = {
      ingredient: {
        quantity: 1000,
        name: 'OctopieMen',
        processing: 'Dancing'
      },
      modifications: {},
      editing: false
    };

    const wrapper = shallow(<Ingredient {...props} />);
    expect(wrapper.text()).toContain('1000OctopieMen,Dancing');
  });

  test('Deleting an ingredient causes it to be restorable', () => {
    const props = {
      ingredient: {
        quantity: 1000,
        name: 'OctopieMen',
        processing: 'Dancing'
      },
      modifications: {},
      editing: false,
      removed: true
    };

    const wrapper = shallow(<Ingredient {...props} />);
    expect(wrapper.find('del').text()).toContain('1000 OctopieMen, Dancing');
    expect(wrapper.exists('[data-test-btn-state="restore"]'));
    // click on trash button
    // expect context button to be restore
    // expect ingredient to be crossed out
  });

  // test('Displays as form inputs when editing is enabled', () => {
  //   const props = {
  //     quantity: 1000,
  //     name: 'OctopieMen',
  //     processing: 'Dancing',
  //     editing: true
  //   };

  //   const wrapper = shallow(<Ingredient {...props} />);
  //   // expect(wrapper.text()).toEqual('1000 OctopieMen Dancing');
  //   // expect container to have inputs
  //   // expect context sensitive btn to be "save"
  // });

  // it requires quantity and name
});
