import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import css from './StepList.css';

export default ({ children, itemId }) => (
  <Droppable type={`STEP-${itemId}`} droppableId={itemId}>
    {provided => (
      <ol
        className={css.steps}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {children}
        {provided.placeholder}
      </ol>
    )}
  </Droppable>
);
