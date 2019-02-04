import { shallow } from 'enzyme';
import React from 'react';

import StepHeader from 'schooled-lunch/client/components/StepHeader';

const setup = () => {
  const wrapper = shallow(<StepHeader />);

  return {
    wrapper,
    instance: wrapper.instance()
  };
};

describe('Displaying ingredient step directions', () => {
  test('clicking on directions enables editing', () => {
    const { wrapper, instance } = setup();
    wrapper.find('.stepDirections').simulate('click');
    expect(instance.state.editing).toEqual(true);
  });

  test('clicking on edit button enables editing', () => {
    const { wrapper, instance } = setup();
    wrapper.find('.editBtn').simulate('click');
    expect(instance.state.editing).toEqual(true);
  });
});
