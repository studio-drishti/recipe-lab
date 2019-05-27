import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import {
  MdDragHandle,
  MdEdit,
  MdClear,
  MdCheck,
  MdRefresh,
  MdAdd
} from 'react-icons/md';
import classnames from 'classnames';

import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';
import DiffText from '../DiffText';

import css from './Item.css';

export default class Item extends PureComponent {
  static displayName = 'Item';

  static propTypes = {
    children: PropTypes.node,
    index: PropTypes.number,
    item: PropTypes.object,
    itemMods: PropTypes.arrayOf(PropTypes.object),
    handleItemChange: PropTypes.func,
    removed: PropTypes.bool,
    isLast: PropTypes.bool,
    removeItem: PropTypes.func,
    restoreItem: PropTypes.func,
    createItem: PropTypes.func,
    createStep: PropTypes.func,
    saveOrUpdateField: PropTypes.func
  };

  static defaultProps = {
    isLast: false
  };

  state = {
    hovering: false,
    editing: false,
    removed: false
  };

  itemRef = React.createRef();
  inputRef = React.createRef();

  componentDidMount() {
    if (this.getItemValue('name') === '') this.enableEditing();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  enableEditing = async () => {
    await this.setState({ editing: true });
    this.inputRef.current.focus();
    document.addEventListener('mousedown', this.handleClick);
  };

  handleSelect = e => {
    e.preventDefault();
    this.enableEditing();
  };

  disableEditing = () => {
    document.removeEventListener('mousedown', this.handleClick);
    if (!this.getItemValue('name')) {
      this.props.removeItem();
    } else {
      this.setState({ editing: false });
    }
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

  handleRemove = e => {
    e.stopPropagation();
    this.props.removeItem();
  };

  handleRestore = e => {
    e.stopPropagation();
    this.props.restoreItem();
  };

  handleSave = e => {
    e.preventDefault();
    this.disableEditing();
    if (!this.getItemValue('name')) this.props.removeItem();
  };

  handleCreateStep = () => {
    const { editing } = this.state;
    const { createStep } = this.props;
    if (!editing) createStep();
  };

  handleCreateItem = () => {
    const { editing } = this.state;
    const { createItem } = this.props;
    if (!editing) createItem();
  };

  renderNameWithMods = () => {
    const { item, removed } = this.props;
    const prefix = 'Directions for ';
    const original = prefix + item.name;

    if (removed) return <del>{original}</del>;

    const modified = prefix + this.getItemValue('name');
    if (original !== modified) {
      return <DiffText original={original} modified={modified} />;
    }

    return original;
  };

  getItemValue = fieldName => {
    const { item, itemMods } = this.props;

    const mod = itemMods.find(
      mod => mod.sourceId === item.uid && mod.field === fieldName
    );
    return mod !== undefined ? mod.value : item[fieldName];
  };

  handleItemChange = e => {
    const { name, value } = e.target;
    const { removed, restoreItem, saveOrUpdateField, item } = this.props;
    if (removed) restoreItem();
    saveOrUpdateField(item, name, value);
  };

  render() {
    const { children, item, index, removed, isLast } = this.props;
    const { hovering, editing } = this.state;
    return (
      <Draggable type="ITEM" draggableId={item.uid} index={index}>
        {(provided, snapshot) => (
          <div
            className={css.itemWrap}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              className={classnames(css.item, {
                [css.hover]: hovering,
                [css.editing]: editing,
                [css.dragging]: snapshot.isDragging
              })}
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
                  <form className={css.itemName}>
                    {editing && (
                      <input
                        type="text"
                        name="name"
                        value={this.getItemValue('name')}
                        ref={this.inputRef}
                        placeholder="Item name"
                        onChange={this.handleItemChange}
                      />
                    )}

                    {!editing && (
                      <h3 onMouseDown={this.handleSelect}>
                        {this.renderNameWithMods()}
                      </h3>
                    )}
                  </form>
                  <div className={css.itemActions}>
                    {editing && (
                      <button
                        title="Save modifications"
                        onClick={this.handleSave}
                      >
                        <MdCheck />
                      </button>
                    )}

                    {!editing && removed && (
                      <button title="Restore item" onClick={this.handleRestore}>
                        <MdRefresh />
                      </button>
                    )}

                    {!editing && !removed && (
                      <>
                        <button
                          title="Edit item name"
                          onClick={this.handleSelect}
                        >
                          <MdEdit />
                        </button>
                        <button title="Remove item" onClick={this.handleRemove}>
                          <MdClear />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {children}
            </div>
            <TextButtonGroup
              className={classnames(css.itemActions, {
                [css.dragging]: snapshot.isDragging
              })}
            >
              <TextButton onClick={this.handleCreateStep} disabled={editing}>
                <MdAdd /> add step
              </TextButton>

              {isLast && (
                <TextButton onClick={this.handleCreateItem} disabled={editing}>
                  <MdAdd /> add item
                </TextButton>
              )}
            </TextButtonGroup>
          </div>
        )}
      </Draggable>
    );
  }
}
