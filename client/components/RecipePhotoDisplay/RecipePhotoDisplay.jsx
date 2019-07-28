import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdDeleteForever } from 'react-icons/md';
import { Mutation, renderToStringWithData } from 'react-apollo';

import css from './RecipePhotoDisplay.css';

export default class RecipePhotoDisplay extends PureComponent {
  static displayName = 'RecipePhotoDisplay';
  static propTypes = {
    photo: PropTypes.object,
    recipeId: PropTypes.string,
    className: PropTypes.string,
    removePhoto: PropTypes.func,
    updatePhoto: PropTypes.func
  };

  render() {
    const { photo, recipeId, className, removePhoto } = this.props;

    return (
      <div>
        {photo && (
          <div
            style={{ backgroundImage: `url(${photo.url})` }}
            className={css.slide}
          />
        )}
      </div>
    );
  }
}
