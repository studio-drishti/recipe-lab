import { mount } from 'enzyme';
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Step from 'recipe-lab/client/components/Step';
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
    step: {
      uid: cuid(),
      directions: 'Do the dumb things I gotta do.'
    }
  };
});

describe('Displaying ingredient steps', () => {
  test('clicking on directions selects the step', () => {
    const { wrapper, instance } = setup(props);
    const spy = jest.spyOn(instance, 'activateStep');
    wrapper.find('.stepDirections').simulate('mouseDown');
    expect(spy).toHaveBeenCalled();
    expect(instance.state.isActive).toEqual(true);
  });

  test('clicking on selected step enables editing', () => {
    const { wrapper, instance } = setup(props);
    const activeStepSpy = jest.spyOn(instance, 'activateStep');
    const enableEditingSpy = jest.spyOn(instance, 'enableEditing');
    wrapper.find('.stepDirections').simulate('mouseDown');
    expect(activeStepSpy).toHaveBeenCalled();
    wrapper.find('.stepDirections').simulate('mouseDown');
    expect(enableEditingSpy).toHaveBeenCalled();
    expect(instance.state.editing).toEqual(true);
  });
});

describe('Creating steps', () => {
  test('focuses on directions when creating a new step', () => {
    props.step.directions = '';
    const { wrapper } = setup(props);
    expect(wrapper.find('textarea[name="directions"]').is(':focus'));
  });
});
