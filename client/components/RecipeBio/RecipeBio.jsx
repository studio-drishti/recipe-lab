import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import css from './RecipeBio.css';

export default class Navigation extends PureComponent {
  static displayName = 'RecipeHeader';
  static propTypes = {
    author: PropTypes.object
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            pellentesque commodo ante, nec facilisis odio faucibus ac. In porta,
            arcu vel mattis posuere, massa felis suscipit dolor, sit amet mattis
            augue nisl ac justo. Fusce imperdiet, leo a viverra interdum, est
            augue lobortis leo, et varius enim elit a leo. Maecenas orci lacus,
            commodo sit amet aliquam ac, tincidunt non nisl. Ut velit lectus,
            elementum ut pretium ultrices, posuere et ipsum.
          </p>
        </div>
      </div>
    );
  }
}
