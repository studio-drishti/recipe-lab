import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import css from './RecipeBio.module.css';

export default class Navigation extends PureComponent {
  static displayName = 'RecipeHeader';
  static propTypes = {
    author: PropTypes.object,
  };

  render() {
    const { author } = this.props;
    return (
      <div className={css.bio}>
        <div>
          <img src={author.avatar} />
        </div>
        <div>
          <h3>About {author.name}</h3>
          <p>{author.bio}</p>
        </div>
      </div>
    );
  }
}
