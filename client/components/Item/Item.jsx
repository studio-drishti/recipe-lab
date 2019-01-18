import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdDragHandle, MdEdit, MdClear, MdCheck } from 'react-icons/md';
import classnames from 'classnames';

import css from './Item.css';

export default class Item extends PureComponent {
  static displayName = 'Item';

  static propTypes = {
    children: PropTypes.node,
    index: PropTypes.number,
    itemId: PropTypes.string,
    handleItemChange: PropTypes.func,
    itemName: PropTypes.node
  };

  state = {
    hovering: false,
    editing: false
  };

  itemRef = React.createRef();
  inputRef = React.createRef();

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  enableEditing = () => {
    this.setState({ editing: true });
    document.addEventListener('mousedown', this.handleClick);
  };

  disableEditing = () => {
    this.setState({ editing: false });
    document.removeEventListener('mousedown', this.handleClick);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.disableEditing();
  };

  handleClick = e => {
    if (this.itemRef.current.contains(e.target)) return;
    this.disableEditing();
  };

  mouseEnter = () => {
    this.setState({ hovering: true });
  };

  mouseLeave = () => {
    this.setState({ hovering: false });
  };

  render() {
    const { children, itemId, index, itemName } = this.props;
    const { hovering, editing } = this.state;
    return (
      <Draggable type="ITEM" draggableId={itemId} index={index}>
        {(provided, snapshot) => (
          <div
            className={classnames(css.item, {
              [css.hover]: hovering,
              [css.editing]: editing,
              [css.dragging]: snapshot.isDragging
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              onMouseOver={this.mouseEnter}
              onMouseLeave={this.mouseLeave}
              className={css.itemHeaderWrap}
              ref={this.itemRef}
            >
              <div className={css.dragHandle} {...provided.dragHandleProps}>
                <MdDragHandle />
              </div>
              <div className={css.itemHeader}>
                <div className={css.itemName} onClick={this.enableEditing}>
                  {itemName &&
                    React.cloneElement(itemName, {
                      editing,
                      innerRef: this.inputRef
                    })}
                </div>
                <div className={css.itemActions}>
                  {editing ? (
                    <button
                      title="Save modifications"
                      onClick={this.disableEditing}
                    >
                      <MdCheck />
                    </button>
                  ) : (
                    <>
                      <button title="Remove item">
                        <MdClear />
                      </button>
                      <button
                        title="Edit item name"
                        onClick={this.enableEditing}
                      >
                        <MdEdit />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {children}
          </div>
        )}
      </Draggable>
    );
  }
}
