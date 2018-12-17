import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MdDragHandle } from 'react-icons/md';

import css from './Item.css';

const Item = ({ children, item, index }) => (
  <Draggable type="ITEM" draggableId={item._id} index={index}>
    {provided => (
      <div
        className={css.item}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <div {...provided.dragHandleProps}>
          <h3>
            <i>
              <MdDragHandle />
            </i>
            Directions for {item.name}
          </h3>
        </div>
        {children}
      </div>
    )}
  </Draggable>
);

Item.displayName = 'Item';
export default Item;
