import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdSchool, MdTimer } from 'react-icons/md';
import Textarea from 'react-textarea-autosize';

import { TIME_OPTIONS, SKILL_OPTIONS } from '../../config';
import css from './RecipeHeader.css';

export default class Navigation extends PureComponent {
  static displayName = 'RecipeHeader';
  static propTypes = {
    recipe: PropTypes.object,
    recipeMods: PropTypes.arrayOf(PropTypes.object)
  };

  state = {
    editing: false,
    errors: {},
    edits: {}
  };

  headerRef = React.createRef();
  titleInputRef = React.createRef();
  descriptionInputRef = React.createRef();
  timeInputRef = React.createRef();
  skillInputRef = React.createRef();

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  getRecipeValue = fieldName => {
    const { edits } = this.state;
    if (edits[fieldName] !== undefined) return edits[fieldName];

    const { recipe, recipeMods } = this.props;
    const mod = recipeMods.find(
      mod => mod.sourceId === recipe.uid && mod.field === fieldName
    );

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

  render() {
    const { editing } = this.state;
    const { recipe } = this.props;
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
                <a onClick={this.enableEditingTitle}>{recipe.title}</a>
              </h1>
              {/* <h2>By {recipe.author.name}</h2> */}
              <p>
                <a onClick={this.enableEditingDescription}>
                  {recipe.description}
                </a>
              </p>
            </>
          )}

          {editing && (
            <form className={css.titleForm}>
              <input
                type="text"
                ref={this.titleInputRef}
                placeholder="Recipe title"
                value={this.getRecipeValue('title')}
              />
              <Textarea
                inputRef={this.descriptionInputRef}
                name="directions"
                value={this.getRecipeValue('description')}
                placeholder="Recipe description"
                onChange={this.handleStepChange}
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
                {recipe.time}
              </a>
              <a onClick={this.enableEditingSkill}>
                <i>
                  <MdSchool />
                </i>
                {recipe.skill}
              </a>
            </>
          )}

          {editing && (
            <form className={css.statsForm}>
              <label>
                <i>
                  <MdTimer />
                </i>
                <select ref={this.timeInputRef}>
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
                <select ref={this.skillInputRef}>
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
