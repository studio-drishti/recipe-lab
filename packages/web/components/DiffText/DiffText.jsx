import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DiffMatchPatch from 'diff-match-patch';

import css from './DiffText.module.css';

export default class DiffText extends PureComponent {
  static displayName = 'DiffText';
  static propTypes = {
    original: PropTypes.string,
    modified: PropTypes.string,
    className: PropTypes.string,
  };

  render() {
    const { original, modified, className } = this.props;
    const dmp = new DiffMatchPatch();
    const diff = dmp.diff_main(original, modified);
    dmp.diff_cleanupSemantic(diff);
    return (
      <span
        aria-label={modified}
        className={classnames(css.diffText, className)}
      >
        {diff.reduce((result, match, i) => {
          const text = match[1].trim();
          if (match[1].startsWith(' ') && i > 0) result.push(' ');
          switch (match[0]) {
            case 1:
              result.push(
                <ins aria-hidden="true" key={i}>
                  {text}
                </ins>
              );
              break;
            case -1:
              result.push(
                <del aria-hidden="true" key={i}>
                  {text}
                </del>
              );
              break;
            default:
              result.push(
                <span aria-hidden="true" key={i}>
                  {text}
                </span>
              );
          }
          if (match[1].endsWith(' ')) result.push(' ');
          return result;
        }, [])}
      </span>
    );
  }
}
