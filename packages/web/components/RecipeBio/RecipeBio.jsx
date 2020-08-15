import React from 'react';
import { getChefBio } from '../../lib/chef';
import css from './RecipeBio.module.css';

const RecipeBio = ({ author }) => (
  <div className={css.bio}>
    <div>
      <img src={author.avatar} />
    </div>
    <div>
      <h3>About {author.name}</h3>
      <p>{getChefBio(author)}</p>
    </div>
  </div>
);

export default RecipeBio;
