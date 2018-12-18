import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdDragHandle } from 'react-icons/md';

import css from './Item.css';

export default class Item extends PureComponent {
  render() {
    const { children, item, index } = this.props;
    return (
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
  }
}

Item.displayName = 'Item';
Item.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  item: PropTypes.object
};
