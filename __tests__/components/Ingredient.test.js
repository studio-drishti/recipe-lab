import { shallow } from 'enzyme';
import React from 'react';

import Ingredient from 'recipe-lab/client/components/Ingredient';

const setup = propOverrides => {
  const props = Object.assign(
    {
      ingredient: {
        quantity: 1,
        unit: 'tbsp',
        name: 'oil',
        processing: 'Fresh pressed!!!!'
      },
      removeIngredient: jest.fn(),
      restoreIngredient: jest.fn(),
      setActiveIngredient: jest.fn()
    },
    propOverrides
  );

  const wrapper = shallow(<Ingredient {...props} />);

  return {
    props,
    wrapper,
    button: wrapper.find('IconButton'),
    container: wrapper.find('li')
  };
};

describe('Displaying ingredient', () => {
  test('ingredient renders with all possible fields', () => {
    const { wrapper } = setup();
    expect(wrapper.text()).toContain('1 tbsp oil, Fresh pressed!!!!');
  });

  test('Comma does not render if no processing', () => {
    const { wrapper } = setup({
      ingredient: {
        quantity: 14.3,
        unit: 'cups',
        name: 'OctopieMen'
      }
    });
    expect(wrapper.text()).toContain('14.3 cups OctopieMen');
  });
});

describe('Deleting and restoring ingredients', () => {
  test('Clicking delete calls the remove action', () => {
    const { props, button } = setup();

    expect(button.prop('aria-label')).toContain('remove');

    button.simulate('click', { stopPropagation() {} });

    expect(props.removeIngredient).toHaveBeenCalled();
  });

  test('Clicking restore calls the restore action', () => {
    const { props, button } = setup({ removed: true });

    expect(button.prop('aria-label')).toContain('restore');

    button.simulate('click', { stopPropagation() {} });

    expect(props.restoreIngredient).toHaveBeenCalled();
  });
});

describe('Editing an ingredient', () => {
  test('Sets the editing id on click', () => {
    const { props, container } = setup();

    container.simulate('click', { stopPropagation() {} });
    expect(props.setActiveIngredient).toHaveBeenCalled();
  });

  test('Displays as form inputs when editing', () => {
    const { button, wrapper } = setup({ editing: true });
    expect(button.prop('aria-label')).toContain('save');
    expect(wrapper.exists('input'));
  });

  // it requires quantity and name
});
