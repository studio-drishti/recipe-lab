import { mount } from 'enzyme';
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Step from 'schooled-lunch/client/components/Step';
import cuid from 'cuid';

let props;

const setup = props => {
  const wrapper = mount(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable type="STEP" droppableId={cuid()}>
        {provided => (
          <ol ref={provided.innerRef} {...provided.droppableProps}>
            <Step {...props} />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );

  return {
    wrapper,
    instance: wrapper.find('Step').instance()
  };
};

beforeEach(() => {
  props = {
    index: 0,
    itemId: cuid(),
    stepId: cuid(),
    activateStep: jest.fn()
  };
});

describe('Displaying ingredient steps', () => {
  test('clicking on directions selects the step', () => {
    const { wrapper } = setup(props);
    wrapper.find('.stepDirections').simulate('click');
    expect(props.activateStep).toBeCalled();
  });

  test('clicking on selected step enables editing', () => {
    props.isActive = true;
    const { wrapper, instance } = setup(props);
    wrapper.find('.stepDirections').simulate('click');
    expect(props.activateStep).toHaveBeenCalledTimes(0);
    expect(instance.state.editing).toEqual(true);
  });

  test('clicking on edit button both selects and enables editing', () => {
    const { wrapper, instance } = setup(props);
    wrapper.find('button[title^="Edit"]').simulate('click');
    expect(props.activateStep).toBeCalled();
    expect(instance.state.editing).toEqual(true);
  });
});
