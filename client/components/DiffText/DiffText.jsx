import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DiffMatchPatch from 'diff-match-patch';

import css from './DiffText.css';

export default class DiffText extends PureComponent {
  static displayName = 'DiffText';
  static propTypes = {
    original: PropTypes.string,
    modified: PropTypes.string
  };

  render() {
    const { original, modified } = this.props;
    const dmp = new DiffMatchPatch();
    const diff = dmp.diff_main(original, modified);
    dmp.diff_cleanupSemantic(diff);
    return (
      <span aria-label={modified} className={css.diffText}>
        {diff.map((match, i) => {
          const text = match[1].trim();
          const hasPunctuation = text.match(/^[.,:;!?]/);
          switch (match[0]) {
            case 1:
              return (
                <ins
                  aria-hidden="true"
                  className={hasPunctuation ? css.punc : undefined}
                  key={i}
                >
                  {text}
                </ins>
              );
            case -1:
              return (
                <del
                  aria-hidden="true"
                  className={hasPunctuation ? css.punc : undefined}
                  key={i}
                >
                  {text}
                </del>
              );
            default:
              return (
                <span
                  aria-hidden="true"
                  className={hasPunctuation ? css.punc : undefined}
                  key={i}
                >
                  {text}
                </span>
              );
          }
        })}
      </span>
    );
  }
}
