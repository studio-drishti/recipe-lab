import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
// import { MdDragHandle } from 'react-icons/md';
import classnames from 'classnames';

import css from './Item.css';

export default class Item extends PureComponent {
  static displayName = 'Item';

  static propTypes = {
    children: PropTypes.node,
    index: PropTypes.number,
    item: PropTypes.object
  };

  state = {
    hovering: false
  };

  mouseEnter = () => {
    this.setState({ hovering: true });
  };

  mouseLeave = () => {
    this.setState({ hovering: false });
  };

  render() {
    const { children, item, index } = this.props;
    const { hovering } = this.state;
    return (
      <Draggable type="ITEM" draggableId={item._id} index={index}>
        {(provided, snapshot) => (
          <div
            className={classnames(css.item, {
              [css.hover]: hovering,
              [css.dragging]: snapshot.isDragging
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              onMouseOver={this.mouseEnter}
              onMouseLeave={this.mouseLeave}
              className={css.dragHandle}
              {...provided.dragHandleProps}
            >
              <h3>Directions for {item.name}</h3>
            </div>
            {children}
          </div>
        )}
      </Draggable>
    );
  }
}
