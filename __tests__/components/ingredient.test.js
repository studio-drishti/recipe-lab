//Editing
//Deleting
//restoring

import { shallow } from 'enzyme';
import React from 'react';
// import renderer from 'react-test-renderer'

import Ingredient from 'schooled-lunch/client/components/Ingredient';

// const component = shallow(<Ingredient />);

describe('Displaying ingredient', () => {
  test('component renders with correct text', () => {
    const props = {
      quantity: 1,
      unit: 'tbsp',
      name: 'oil'
    };

    const wrapper = shallow(<Ingredient {...props} />);
    expect(wrapper.text()).toEqual('1 tbsp oil');
  });

  //   test('does not display processing if none provided', () => {});

  //   test('does not show unit if none provided', () => {});
});
