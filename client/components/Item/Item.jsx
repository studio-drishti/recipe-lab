import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import css from './Item.css';

export default ({ children, item, index }) => (
  <Draggable type="ITEM" draggableId={item._id} index={index}>
    {(provided, snapshot) => (
      <div
        className={css.item}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <div {...provided.dragHandleProps}>
          <h3>
            <i className="material-icons">drag_indicator</i>
            Directions for {item.name}
          </h3>
        </div>
        {children}
      </div>
    )}
  </Draggable>
);
