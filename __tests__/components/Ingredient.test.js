import { mount } from 'enzyme';
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import cuid from 'cuid';

import Ingredient from 'recipe-lab/client/components/Ingredient';

const setup = propOverrides => {
  const props = Object.assign(
    {
      index: 0,
      ingredient: {
        uid: cuid(),
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

  const wrapper = mount(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable type="INGREDIENT" droppableId={cuid()}>
        {provided => (
          <ol ref={provided.innerRef} {...provided.droppableProps}>
            <Ingredient {...props} />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );

  return {
    props,
    wrapper,
    container: wrapper.find('.ingredient')
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
        uid: cuid(),
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
    const { props, wrapper } = setup();

    wrapper
      .find('button[aria-label^="remove"]')
      .simulate('click', { stopPropagation() {} });

    expect(props.removeIngredient).toHaveBeenCalled();
  });

  test('Clicking restore calls the restore action', () => {
    const { props, wrapper } = setup({ removed: true });

    wrapper
      .find('button[aria-label^="restore"]')
      .simulate('click', { stopPropagation() {} });

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
    const { wrapper } = setup({ editing: true });
    expect(wrapper.exists('button[aria-label^="save"]'));
    expect(wrapper.exists('input'));
  });

  // it requires quantity and name
});
