import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';

import css from './Directions.css';
import DiffText from '../DiffText';

export default class Ingredient extends Component {
  static displayName = 'Directions';

  static propTypes = {
    directions: PropTypes.string,
    mod: PropTypes.string,
    editing: PropTypes.bool,
    removed: PropTypes.bool
  };

  static defaultProps = {
    mod: undefined,
    editing: false,
    removed: false
  };

  renderDirectionsWithMods = () => {
    const { mod, directions } = this.props;
    if (mod !== undefined) {
      return <DiffText original={directions} modified={mod} />;
    } else {
      return directions;
    }
  };

  getDirectionsValue = () => {
    const { mod, directions } = this.props;
    return mod !== undefined ? mod : directions;
  };

  render() {
    const { editing, directions } = this.props;

    return (
      <form className={css.directions}>
        {editing ? (
          <Textarea
            name="directions"
            value={this.getDirectionsValue()}
            placeholder={directions.length ? directions : 'Directions'}
            onChange={this.handleStepChange}
          />
        ) : (
          <p>{this.renderDirectionsWithMods()}</p>
        )}
      </form>
    );
  }
}
