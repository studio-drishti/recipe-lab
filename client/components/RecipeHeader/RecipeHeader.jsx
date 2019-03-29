import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdSchool, MdTimer } from 'react-icons/md';
import Textarea from 'react-textarea-autosize';

import { TIME_OPTIONS, SKILL_OPTIONS } from '../../config';
import DiffText from '../DiffText';
import css from './RecipeHeader.css';

export default class Navigation extends PureComponent {
  static displayName = 'RecipeHeader';
  static propTypes = {
    recipe: PropTypes.object,
    recipeMods: PropTypes.arrayOf(PropTypes.object),
    saveAlteration: PropTypes.func
  };

  state = {
    editing: false
  };

  headerRef = React.createRef();
  titleInputRef = React.createRef();
  descriptionInputRef = React.createRef();
  timeInputRef = React.createRef();
  skillInputRef = React.createRef();

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  renderWithMods = fieldName => {
    const { recipeMods, recipe } = this.props;
    const mod = recipeMods.find(mod => mod.field === fieldName);
    if (mod !== undefined) {
      return <DiffText original={recipe[fieldName]} modified={mod.value} />;
    } else {
      return recipe[fieldName];
    }
  };

  getRecipeValue = fieldName => {
    const { recipe, recipeMods } = this.props;
    const mod = recipeMods.find(mod => mod.field === fieldName);

    return mod !== undefined ? mod.value : recipe[fieldName];
  };

  enableEditing = () => {
    this.setState({ editing: true });
    document.addEventListener('mousedown', this.handleClick);
  };

  enableEditingTitle = async () => {
    await this.enableEditing();
    if (this.titleInputRef.current) this.titleInputRef.current.focus();
  };

  enableEditingDescription = async () => {
    await this.enableEditing();
    if (this.descriptionInputRef.current)
      this.descriptionInputRef.current.focus();
  };

  enableEditingTime = async () => {
    await this.enableEditing();
    if (this.timeInputRef.current) this.timeInputRef.current.focus();
  };

  enableEditingSkill = async () => {
    await this.enableEditing();
    if (this.skillInputRef.current) this.skillInputRef.current.focus();
  };

  disableEditing = () => {
    this.setState({ editing: false });
    document.removeEventListener('mousedown', this.handleClick);
  };

  handleClick = e => {
    if (this.headerRef.current.contains(e.target)) return;
    this.disableEditing();
  };

  handleRecipeChange = e => {
    const { name, value } = e.target;
    const { recipe, saveAlteration } = this.props;
    saveAlteration(recipe, name, value);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.disableEditing();
  };

  render() {
    const { editing } = this.state;
    return (
      <header
        ref={this.headerRef}
        style={{
          backgroundImage:
            'url(https://loremflickr.com/1200/600/food,cooking,spaghetti)'
        }}
        className={css.header}
      >
        <div className={css.title}>
          {!editing && (
            <>
              <h1>
                <a onClick={this.enableEditingTitle}>
                  {this.renderWithMods('title')}
                </a>
              </h1>
              <p>
                <a onClick={this.enableEditingDescription}>
                  {this.renderWithMods('description')}
                </a>
              </p>
            </>
          )}

          {editing && (
            <form onSubmit={this.handleSubmit} className={css.titleForm}>
              <input
                type="text"
                name="title"
                ref={this.titleInputRef}
                placeholder="Recipe title"
                value={this.getRecipeValue('title')}
                onChange={this.handleRecipeChange}
              />
              <Textarea
                inputRef={this.descriptionInputRef}
                name="description"
                value={this.getRecipeValue('description')}
                placeholder="Recipe description"
                onChange={this.handleRecipeChange}
              />
            </form>
          )}
        </div>
        <div className={css.stats}>
          {!editing && (
            <>
              <a onClick={this.enableEditingTime}>
                <i>
                  <MdTimer />
                </i>
                {this.getRecipeValue('time')}
              </a>
              <a onClick={this.enableEditingSkill}>
                <i>
                  <MdSchool />
                </i>
                {this.getRecipeValue('skill')}
              </a>
            </>
          )}

          {editing && (
            <form onSubmit={this.handleSubmit} className={css.statsForm}>
              <label>
                <i>
                  <MdTimer />
                </i>
                <select
                  name="time"
                  onChange={this.handleRecipeChange}
                  ref={this.timeInputRef}
                  value={this.getRecipeValue('time')}
                >
                  {TIME_OPTIONS.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <i>
                  <MdSchool />
                </i>
                <select
                  name="skill"
                  onChange={this.handleRecipeChange}
                  ref={this.skillInputRef}
                  value={this.getRecipeValue('skill')}
                >
                  {SKILL_OPTIONS.map(skill => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </label>
            </form>
          )}
        </div>
      </header>
    );
  }
}
