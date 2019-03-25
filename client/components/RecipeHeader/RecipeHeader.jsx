import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdSchool, MdTimer } from 'react-icons/md';

import css from './RecipeHeader.css';

export default class Navigation extends PureComponent {
  static displayName = 'RecipeHeader';
  static propTypes = {
    recipe: PropTypes.object
  };

  render() {
    const { recipe } = this.props;
    return (
      <header
        style={{
          backgroundImage:
            'url(https://loremflickr.com/1200/600/food,cooking,spaghetti)'
        }}
        className={css.header}
      >
        <div className={css.title}>
          <h1>{recipe.title}</h1>
          <h2>By {recipe.author.name}</h2>
          <p>{recipe.description}</p>
        </div>
        <div className={css.stats}>
          <span>
            <i>
              <MdTimer />
            </i>
            {recipe.time}
          </span>
          <span>
            <i>
              <MdSchool />
            </i>
            {recipe.skill}
          </span>
        </div>
      </header>
    );
  }
}
