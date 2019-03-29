import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';

import css from './Directions.css';
import DiffText from '../DiffText';

export default class Ingredient extends PureComponent {
  static displayName = 'Directions';

  static propTypes = {
    step: PropTypes.object,
    mod: PropTypes.string,
    editing: PropTypes.bool,
    removed: PropTypes.bool,
    saveOrUpdateField: PropTypes.func,
    restoreStep: PropTypes.func,
    inputRef: PropTypes.shape({
      current: PropTypes.any
    })
  };

  static defaultProps = {
    mod: undefined,
    editing: false,
    removed: false
  };

  renderDirectionsWithMods = () => {
    const { mod, step } = this.props;
    if (mod !== undefined) {
      return <DiffText original={step.directions} modified={mod} />;
    } else {
      return step.directions;
    }
  };

  getDirectionsValue = () => {
    const { mod, step } = this.props;
    return mod !== undefined ? mod : step.directions;
  };

  handleStepChange = e => {
    const { name, value } = e.target;
    const { step, removed, saveOrUpdateField, restoreStep } = this.props;
    if (removed) restoreStep();
    saveOrUpdateField(step, name, value);
  };

  render() {
    const { editing, removed, step, inputRef } = this.props;

    return (
      <form className={css.directions}>
        {editing && (
          <Textarea
            inputRef={inputRef}
            name="directions"
            value={this.getDirectionsValue()}
            placeholder="Directions"
            onChange={this.handleStepChange}
          />
        )}

        {!editing && removed && <del>{step.directions}</del>}

        {!editing && !removed && <p>{this.renderDirectionsWithMods()}</p>}
      </form>
    );
  }
}
